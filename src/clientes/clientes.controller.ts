import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nuevo cliente',
    description: 'Crea un nuevo cliente en el sistema'
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: Cliente,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  @ApiConflictResponse({
    description: 'El email ya está registrado'
  })
  async create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return await this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los clientes',
    description: 'Obtiene la lista completa de clientes ordenados por fecha de creación'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
    type: [Cliente],
  })
  @ApiQuery({
    name: 'activos',
    required: false,
    type: 'boolean',
    description: 'Filtrar solo clientes activos'
  })
  async findAll(@Query('activos') activos?: string): Promise<Cliente[]> {
    if (activos === 'true') {
      return await this.clientesService.findActive();
    }
    return await this.clientesService.findAll();
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Buscar clientes',
    description: 'Busca clientes por nombre, apellido o email'
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos exitosamente',
    type: [Cliente],
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: 'string',
    description: 'Término de búsqueda (mínimo 2 caracteres)',
    example: 'Juan'
  })
  @ApiBadRequestResponse({
    description: 'Término de búsqueda inválido'
  })
  async search(@Query('q') searchTerm: string): Promise<Cliente[]> {
    return await this.clientesService.search(searchTerm);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Estadísticas de clientes',
    description: 'Obtiene estadísticas básicas de clientes'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 150 },
        activos: { type: 'number', example: 135 },
        inactivos: { type: 'number', example: 15 }
      }
    }
  })
  async getStats() {
    const total = await this.clientesService.count();
    const activos = await this.clientesService.countActive();
    
    return {
      total,
      activos,
      inactivos: total - activos
    };
  }

  @Get('ciudad/:ciudad')
  @ApiOperation({ 
    summary: 'Obtener clientes por ciudad',
    description: 'Obtiene todos los clientes de una ciudad específica'
  })
  @ApiParam({
    name: 'ciudad',
    type: 'string',
    description: 'Nombre de la ciudad',
    example: 'Portoviejo'
  })
  @ApiResponse({
    status: 200,
    description: 'Clientes por ciudad obtenidos exitosamente',
    type: [Cliente],
  })
  @ApiBadRequestResponse({
    description: 'Ciudad no proporcionada'
  })
  async findByCity(@Param('ciudad') ciudad: string): Promise<Cliente[]> {
    return await this.clientesService.findByCity(ciudad);
  }

  @Get('email/:email')
  @ApiOperation({ 
    summary: 'Obtener cliente por email',
    description: 'Busca un cliente específico por su email'
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email del cliente',
    example: 'juan.perez@email.com'
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
    type: Cliente,
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  async findByEmail(@Param('email') email: string): Promise<Cliente> {
    return await this.clientesService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener cliente por ID',
    description: 'Obtiene un cliente específico por su ID'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del cliente',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
    type: Cliente,
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'ID inválido'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return await this.clientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar cliente',
    description: 'Actualiza los datos de un cliente existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del cliente a actualizar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
    type: Cliente,
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  @ApiConflictResponse({
    description: 'El email ya está registrado por otro cliente'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return await this.clientesService.update(id, updateClienteDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Desactivar cliente',
    description: 'Desactiva un cliente (soft delete)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del cliente a desactivar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente desactivado exitosamente',
    type: Cliente,
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return await this.clientesService.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ 
    summary: 'Activar cliente',
    description: 'Activa un cliente previamente desactivado'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del cliente a activar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente activado exitosamente',
    type: Cliente,
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  async activate(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return await this.clientesService.activate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar cliente',
    description: 'Elimina permanentemente un cliente del sistema (hard delete)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del cliente a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Cliente eliminado exitosamente'
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'No se puede eliminar el cliente (puede tener pedidos asociados)'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.clientesService.remove(id);
  }
}