import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaginaService } from './pagina.service';
import { CreatePaginaDto } from './dto/pagina.dto';
import { Pagina } from './entities/pagina.entity';

/**
 * PaginaController — Exposes the Pagina module's HTTP surface.
 *
 * v0.1 surface: POST /pagina (create a new page)
 * All validation is handled by the global ValidationPipe configured
 * in main.ts (whitelist: true, transform: true, forbidNonWhitelisted: true).
 */
@Controller('pagina')
export class PaginaController {
  constructor(private readonly paginaService: PaginaService) {}

  /**
   * POST /pagina
   *
   * Accepts a JSON body matching CreatePaginaDto.
   * The ValidationPipe will transform and polymorphically validate
   * each component block before the service is ever called.
   *
   * Returns 201 Created with the persisted Pagina entity.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaginaDto: CreatePaginaDto): Promise<Pagina> {
    return this.paginaService.create(createPaginaDto);
  }
}
