import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Pagina } from './entities/pagina.entity';
import { CreatePaginaDto } from './dto/pagina.dto';

/**
 * PaginaCreatedEvent
 *
 * Payload published on the `pagina.created` event channel.
 * Intellectus will listen to this to register the page in its tree.
 * Portus will listen to this to prepare transfer metadata.
 *
 * This is the ONLY communication contract between Pagina and other modules.
 * No service imports. No shared repositories. Pure events.
 */
export class PaginaCreatedEvent {
  constructor(
    public readonly paginaId: string,
    public readonly title: string,
    public readonly createdAt: Date,
  ) {}
}

@Injectable()
export class PaginaService {
  constructor(
    /**
     * Pagina owns its own TypeORM repository. No other module may inject this.
     */
    @InjectRepository(Pagina)
    private readonly paginaRepository: Repository<Pagina>,

    /**
     * EventEmitter2 is the message bus. It is infrastructure-level (not a module
     * dependency), so injecting it here does NOT violate isolation rules.
     */
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * create — Persists a new Pagina and publishes a domain event.
   *
   * The DTO has already been validated polymorphically before reaching
   * this method, so `components` is a well-typed, validated array.
   */
  async create(createPaginaDto: CreatePaginaDto): Promise<Pagina> {
    const pagina = this.paginaRepository.create({
      title: createPaginaDto.title,
      // components is stored verbatim into the JSONB column.
      // TypeORM handles JSON serialization automatically.
      components: createPaginaDto.components as unknown as Record<string, unknown>[],
    });

    const saved = await this.paginaRepository.save(pagina);

    /**
     * Publish `pagina.created` event.
     *
     * Any module with an @OnEvent('pagina.created') listener will receive
     * this payload asynchronously. Pagina does not know — or care — who listens.
     * This keeps the module boundary clean and the dependency graph acyclic.
     */
    this.eventEmitter.emit(
      'pagina.created',
      new PaginaCreatedEvent(saved.id, saved.title, saved.createdAt),
    );

    return saved;
  }
}
