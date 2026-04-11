import {
  IsString,
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ---------------------------------------------------------------------------
// BASE COMPONENT
// ---------------------------------------------------------------------------

/**
 * BaseComponentDto — Every component block must carry these three fields.
 * The `type` discriminator is what drives polymorphic validation below.
 */
export abstract class BaseComponentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  order: number;

  @IsString()
  @IsNotEmpty()
  type: string;
}

// ---------------------------------------------------------------------------
// CONCRETE COMPONENT DTOs
// ---------------------------------------------------------------------------

export class TextComponentDto extends BaseComponentDto {
  @IsIn(['text'])
  type: 'text';

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class QuestionComponentDto extends BaseComponentDto {
  @IsIn(['question'])
  type: 'question';

  @IsString()
  @IsNotEmpty()
  prompt: string;

  /**
   * Describes the expected answer format, e.g. 'open', 'multiple-choice', 'boolean'.
   */
  @IsString()
  @IsNotEmpty()
  answerType: string;
}

export class ExampleComponentDto extends BaseComponentDto {
  @IsIn(['example'])
  type: 'example';

  @IsString()
  @IsNotEmpty()
  context: string;
}

// ---------------------------------------------------------------------------
// DISCRIMINATED UNION TYPE  (used only at the TS level for type safety)
// ---------------------------------------------------------------------------
export type AnyComponentDto =
  | TextComponentDto
  | QuestionComponentDto
  | ExampleComponentDto;

// ---------------------------------------------------------------------------
// POLYMORPHIC TRANSFORM FUNCTION
// ---------------------------------------------------------------------------

/**
 * resolveComponentDto
 *
 * Used inside @Transform() to inspect the raw `type` field of each component
 * object and instantiate the correct DTO class.
 *
 * class-transformer will then call @ValidateNested() on the resolved instance,
 * which triggers class-validator rules defined in the concrete DTO classes.
 *
 * This is the heart of polymorphic validation: no giant switch statement
 * in the service — it lives here, at the boundary.
 */
function resolveComponentDto(value: unknown): AnyComponentDto {
  if (typeof value !== 'object' || value === null) {
    // Return as-is; class-validator will catch the error via @ValidateNested.
    return value as AnyComponentDto;
  }

  const raw = value as { type?: string };

  switch (raw.type) {
    case 'text':
      return Object.assign(new TextComponentDto(), raw);
    case 'question':
      return Object.assign(new QuestionComponentDto(), raw);
    case 'example':
      return Object.assign(new ExampleComponentDto(), raw);
    default:
      // Fall back to base; @IsIn on `type` in each concrete class will
      // surface the validation error with a meaningful message.
      return Object.assign(new TextComponentDto(), raw);
  }
}

// ---------------------------------------------------------------------------
// CREATE PAGINA DTO
// ---------------------------------------------------------------------------

export class CreatePaginaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * components — A polymorphic array of component blocks.
   *
   * Validation pipeline:
   * 1. @IsArray()          — must be an array.
   * 2. @Transform()        — each element is transformed into the correct
   *                          typed DTO class via resolveComponentDto().
   * 3. @ValidateNested()   — class-validator recurses into each DTO instance.
   * 4. @Type(() => BaseComponentDto) — tells class-transformer to walk the
   *    array. The @Transform override happens before @Type, so the concrete
   *    class is already in place when nested validation fires.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return value;
    return value.map(resolveComponentDto);
  })
  @Type(() => BaseComponentDto)
  components: AnyComponentDto[];
}
