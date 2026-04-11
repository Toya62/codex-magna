import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Pagina Entity — The Thinking Engine
 *
 * Represents a single "page" in Codex Magna.
 * The `components` column is stored as PostgreSQL JSONB, allowing
 * a flexible, schema-less array of typed component blocks.
 * Intellectus knows this page exists (by ID/title); it does NOT
 * read or write to this table.
 */
@Entity('paginas')
export class Pagina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * Stores an ordered array of polymorphic component blocks.
   * Each block is discriminated by a `type` field (e.g. 'text', 'question', 'example').
   * Validated at the DTO layer before reaching this column.
   */
  @Column({ type: 'jsonb', default: [] })
  components: Record<string, unknown>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
