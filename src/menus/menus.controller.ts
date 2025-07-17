import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoriaMenuDto } from './dto/create-categoria-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    return await this.menusService.create(createMenuDto);
  }

  @Post("categoria")
  async createCategoria(@Body() createCategoriaMenuDto: CreateCategoriaMenuDto) {
    return await this.menusService.createCategoria(createCategoriaMenuDto);
  }

  @Get()
  async findAll() {
    return await this.menusService.findAll();
  }

  @Get("categoria")
  async asryfindAllCategorias() {
    return await this.menusService.findAllCategorias();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
