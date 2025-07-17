import { Module } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { PlatosController } from './platos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../menus/entities/menu.entity';
import { Plato } from './entities/plato.entity';
import { Insumo } from './entities/insumo.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Menu, Plato, Insumo]),
    ],
  controllers: [PlatosController],
  providers: [PlatosService],
  exports: [PlatosService, TypeOrmModule.forFeature([Plato, Insumo])],
})
export class PlatosModule {}
