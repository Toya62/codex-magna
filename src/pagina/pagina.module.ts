import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagina } from './entities/pagina.entity';
import { PaginaService } from './pagina.service';
import { PaginaController } from './pagina.controller';

/**
 * PaginaModule — Self-contained. No imports from other Codex Magna modules.
 *
 * TypeOrmModule.forFeature([Pagina]) registers the repository scoped to
 * this module only. Other modules CANNOT inject PaginaRepository.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Pagina])],
  controllers: [PaginaController],
  providers: [PaginaService],
  // exports: [] — intentionally empty. No leaking of internals.
})
export class PaginaModule {}
