import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { CategoriaMenu } from './entities/categoria_menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, CategoriaMenu]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService], // Exportamos el service para uso en otros módulos
})
export class MenusModule {}