import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoriaMenuDto } from './dto/create-categoria-menu.dto';
import { Menu } from './entities/menu.entity';
import { CategoriaMenu } from './entities/categoria_menu.entity'; // ← CORREGIDO

@ApiTags('Menús')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nuevo menú',
    description: 'Crea un nuevo menú en el sistema'
  })
  @ApiResponse({
    status: 201,
    description: 'Menú creado exitosamente',
    type: Menu,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return await this.menusService.create(createMenuDto);
  }

  @Post('categoria')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nueva categoría de menú',
    description: 'Crea una nueva categoría para clasificar menús'
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
    type: CategoriaMenu,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  async createCategoria(@Body() createCategoriaMenuDto: CreateCategoriaMenuDto): Promise<CategoriaMenu> {
    return await this.menusService.createCategoria(createCategoriaMenuDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los menús',
    description: 'Obtiene la lista completa de menús con sus categorías'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de menús obtenida exitosamente',
    type: [Menu],
  })
  async findAll(): Promise<Menu[]> {
    return await this.menusService.findAll();
  }

  @Get('categoria')
  @ApiOperation({ 
    summary: 'Obtener todas las categorías',
    description: 'Obtiene la lista completa de categorías de menús'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    type: [CategoriaMenu],
  })
  async findAllCategorias(): Promise<CategoriaMenu[]> {
    return await this.menusService.findAllCategorias();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener menú por ID',
    description: 'Obtiene un menú específico con su categoría'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del menú',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Menú encontrado exitosamente',
    type: Menu,
  })
  @ApiNotFoundResponse({
    description: 'Menú no encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Menu> {
    return await this.menusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar menú',
    description: 'Actualiza los datos de un menú existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del menú a actualizar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Menú actualizado exitosamente',
    type: Menu,
  })
  @ApiNotFoundResponse({
    description: 'Menú no encontrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMenuDto: UpdateMenuDto
  ): Promise<Menu> {
    return await this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar menú',
    description: 'Elimina un menú del sistema'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del menú a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Menú eliminado exitosamente'
  })
  @ApiNotFoundResponse({
    description: 'Menú no encontrado'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.menusService.remove(id);
  }
}