import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaginaModule } from './pagina/pagina.module';
import { Pagina } from './pagina/entities/pagina.entity';

/**
 * AppModule — Root module for Codex Magna v0.1.
 *
 * Architecture notes:
 * - EventEmitterModule.forRoot() is registered ONCE here at the root.
 *   It acts as the shared message bus. Each module injects EventEmitter2
 *   directly from @nestjs/event-emitter — no cross-module service imports.
 * - TypeOrmModule.forRoot() owns the single DB connection. Each feature
 *   module registers its own entities via TypeOrmModule.forFeature().
 * - Future modules (Intellectus, Ambitus, Portus) are added here as siblings.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'postgres',
      database: process.env.DB_NAME ?? 'codex_magna',
      entities: [Pagina],
      // Use migrations in production. synchronize: true is for dev only.
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    /**
     * EventEmitterModule — wildcard: true allows listeners like
     * @OnEvent('pagina.*') to catch all Pagina events. Useful for
     * future Portus audit logging.
     */
    EventEmitterModule.forRoot({ wildcard: true }),

    PaginaModule,
    // IntellectusModule,  <-- registered here when built
    // AmbitusModule,
    // PortusModule,
  ],
})
export class AppModule {}
