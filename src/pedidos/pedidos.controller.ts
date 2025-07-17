import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
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
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './entities/pedido.entity';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nuevo pedido',
    description: 'Crea un nuevo pedido de catering'
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido creado exitosamente',
    type: Pedido,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o cliente no existe'
  })
  async create(@Body() createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    return await this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los pedidos',
    description: 'Obtiene la lista completa de pedidos con información del cliente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos obtenida exitosamente',
    type: [Pedido],
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    type: 'string',
    description: 'Filtrar por estado del pedido',
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO']
  })
  async findAll(@Query('estado') estado?: string): Promise<Pedido[]> {
    if (estado) {
      return await this.pedidosService.findByStatus(estado);
    }
    return await this.pedidosService.findAll();
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Estadísticas de pedidos',
    description: 'Obtiene estadísticas generales de pedidos e ingresos'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalPedidos: { type: 'number', example: 150 },
        pedidosHoy: { type: 'number', example: 5 },
        totalIngresos: { type: 'number', example: 12500.50 },
        porEstado: {
          type: 'object',
          properties: {
            PENDIENTE: { type: 'number', example: 10 },
            CONFIRMADO: { type: 'number', example: 15 },
            EN_PREPARACION: { type: 'number', example: 8 },
            LISTO: { type: 'number', example: 3 },
            ENTREGADO: { type: 'number', example: 100 },
            CANCELADO: { type: 'number', example: 14 }
          }
        }
      }
    }
  })
  async getStats() {
    return await this.pedidosService.getStats();
  }

  @Get('hoy')
  @ApiOperation({ 
    summary: 'Pedidos de hoy',
    description: 'Obtiene todos los pedidos programados para el día de hoy'
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos de hoy obtenidos exitosamente',
    type: [Pedido],
  })
  async findToday(): Promise<Pedido[]> {
    return await this.pedidosService.findToday();
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ 
    summary: 'Pedidos por cliente',
    description: 'Obtiene todos los pedidos de un cliente específico'
  })
  @ApiParam({
    name: 'clienteId',
    type: 'number',
    description: 'ID del cliente',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos del cliente obtenidos exitosamente',
    type: [Pedido],
  })
  @ApiNotFoundResponse({
    description: 'Cliente no encontrado'
  })
  async findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number): Promise<Pedido[]> {
    return await this.pedidosService.findByCliente(clienteId);
  }

  @Get('rango-fechas')
  @ApiOperation({ 
    summary: 'Pedidos por rango de fechas',
    description: 'Obtiene pedidos en un rango de fechas de evento'
  })
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: 'string',
    description: 'Fecha inicio (YYYY-MM-DD)',
    example: '2025-07-01'
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: 'string',
    description: 'Fecha fin (YYYY-MM-DD)',
    example: '2025-07-31'
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos en el rango obtenidos exitosamente',
    type: [Pedido],
  })
  @ApiBadRequestResponse({
    description: 'Fechas inválidas'
  })
  async findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ): Promise<Pedido[]> {
    return await this.pedidosService.findByEventDateRange(fechaInicio, fechaFin);
  }

  @Get('estado/:estado')
  @ApiOperation({ 
    summary: 'Pedidos por estado',
    description: 'Obtiene todos los pedidos con un estado específico'
  })
  @ApiParam({
    name: 'estado',
    type: 'string',
    description: 'Estado del pedido',
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'],
    example: 'PENDIENTE'
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos por estado obtenidos exitosamente',
    type: [Pedido],
  })
  async findByStatus(@Param('estado') estado: string): Promise<Pedido[]> {
    return await this.pedidosService.findByStatus(estado);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener pedido por ID',
    description: 'Obtiene un pedido específico con información del cliente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pedido',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado exitosamente',
    type: Pedido,
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return await this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar pedido',
    description: 'Actualiza los datos de un pedido existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pedido a actualizar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido actualizado exitosamente',
    type: Pedido,
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return await this.pedidosService.update(id, updatePedidoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ 
    summary: 'Cambiar estado del pedido',
    description: 'Cambia el estado de un pedido específico'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pedido',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del pedido actualizado exitosamente',
    type: Pedido,
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'Estado inválido'
  })
  @ApiConflictResponse({
    description: 'Transición de estado no permitida'
  })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado: string },
  ): Promise<Pedido> {
    return await this.pedidosService.changeStatus(id, body.estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar pedido',
    description: 'Elimina un pedido (solo si está en estado PENDIENTE)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pedido a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Pedido eliminado exitosamente'
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado'
  })
  @ApiConflictResponse({
    description: 'No se puede eliminar pedido (estado diferente a PENDIENTE)'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.pedidosService.remove(id);
  }
}