import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Platos')
@Controller('platos')
export class PlatosController {
  constructor(private readonly platosService: PlatosService) {}
  
  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo plato',
    description: 'Crea un nuevo plato en el sistema'
  })
  create(@Body() createPlatoDto: CreatePlatoDto) {
    return this.platosService.create(createPlatoDto);
  }

  @Post("insumo")
  @ApiOperation({ 
    summary: 'Crear nuevo insumo',
    description: 'Crea un nuevo insumo para los platos'
  })
  createInsumo(@Body() createInsumoDto: CreateInsumoDto) {
    return this.platosService.createInsumo(createInsumoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los platos',
    description: 'Obtiene la lista completa de platos con sus insumos y menús'
  })
  findAll() {
    return this.platosService.findAll();
  }

  @Get("insumos")
  @ApiOperation({ 
    summary: 'Obtener todos los insumos',
    description: 'Obtiene la lista completa de insumos disponibles'
  })
  findAllInsumos() {
    return this.platosService.findAllInsumos();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener plato por ID',
    description: 'Obtiene un plato específico con sus relaciones'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del plato',
    example: 1
  })
  findOne(@Param('id') id: string) {
    return this.platosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar plato',
    description: 'Actualiza los datos de un plato existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del plato a actualizar',
    example: 1
  })
  update(@Param('id') id: string, @Body() updatePlatoDto: UpdatePlatoDto) {
    return this.platosService.update(+id, updatePlatoDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar plato',
    description: 'Elimina un plato del sistema'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del plato a eliminar',
    example: 1
  })
  remove(@Param('id') id: string) {
    return this.platosService.remove(+id);
  }
}
