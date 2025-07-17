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
import { EntregasService } from './entrega.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregasDto } from './dto/update-entrega.dto';
import { Entrega } from './entities/entrega.entity';

@ApiTags('Entregas')
@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Programar nueva entrega',
    description: 'Crea una nueva entrega asociada a un pedido'
  })
  @ApiResponse({
    status: 201,
    description: 'Entrega programada exitosamente',
    type: Entrega,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o pedido no existe'
  })
  @ApiConflictResponse({
    description: 'El pedido ya tiene una entrega programada'
  })
  async create(@Body() createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    return await this.entregasService.create(createEntregaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las entregas',
    description: 'Obtiene la lista completa de entregas con información del pedido y cliente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de entregas obtenida exitosamente',
    type: [Entrega],
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    type: 'string',
    description: 'Filtrar por estado de la entrega',
    enum: ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA']
  })
  async findAll(@Query('estado') estado?: string): Promise<Entrega[]> {
    if (estado) {
      return await this.entregasService.findByStatus(estado);
    }
    return await this.entregasService.findAll();
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Estadísticas de entregas',
    description: 'Obtiene estadísticas generales de entregas y tasa de completado'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalEntregas: { type: 'number', example: 150 },
        entregasHoy: { type: 'number', example: 8 },
        completadas: { type: 'number', example: 120 },
        tasaCompletado: { type: 'number', example: 80 },
        porEstado: {
          type: 'object',
          properties: {
            PROGRAMADA: { type: 'number', example: 15 },
            EN_RUTA: { type: 'number', example: 8 },
            ENTREGADA: { type: 'number', example: 120 },
            CANCELADA: { type: 'number', example: 7 }
          }
        }
      }
    }
  })
  async getStats() {
    return await this.entregasService.getStats();
  }

  @Get('hoy')
  @ApiOperation({ 
    summary: 'Entregas de hoy',
    description: 'Obtiene todas las entregas programadas para el día de hoy'
  })
  @ApiResponse({
    status: 200,
    description: 'Entregas de hoy obtenidas exitosamente',
    type: [Entrega],
  })
  async findToday(): Promise<Entrega[]> {
    return await this.entregasService.findToday();
  }

  @Get('conductor/:conductor')
  @ApiOperation({ 
    summary: 'Entregas por conductor',
    description: 'Obtiene todas las entregas asignadas a un conductor específico'
  })
  @ApiParam({
    name: 'conductor',
    type: 'string',
    description: 'Nombre del conductor',
    example: 'Carlos Mendoza'
  })
  @ApiResponse({
    status: 200,
    description: 'Entregas del conductor obtenidas exitosamente',
    type: [Entrega],
  })
  async findByConductor(@Param('conductor') conductor: string): Promise<Entrega[]> {
    return await this.entregasService.findByConductor(conductor);
  }

  @Get('rango-fechas')
  @ApiOperation({ 
    summary: 'Entregas por rango de fechas',
    description: 'Obtiene entregas en un rango de fechas de entrega'
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
    description: 'Entregas en el rango obtenidas exitosamente',
    type: [Entrega],
  })
  @ApiBadRequestResponse({
    description: 'Fechas inválidas'
  })
  async findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ): Promise<Entrega[]> {
    return await this.entregasService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get('estado/:estado')
  @ApiOperation({ 
    summary: 'Entregas por estado',
    description: 'Obtiene todas las entregas con un estado específico'
  })
  @ApiParam({
    name: 'estado',
    type: 'string',
    description: 'Estado de la entrega',
    enum: ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA'],
    example: 'PROGRAMADA'
  })
  @ApiResponse({
    status: 200,
    description: 'Entregas por estado obtenidas exitosamente',
    type: [Entrega],
  })
  async findByStatus(@Param('estado') estado: string): Promise<Entrega[]> {
    return await this.entregasService.findByStatus(estado);
  }

  @Get('pedido/:pedidoId')
  @ApiOperation({ 
    summary: 'Entrega por pedido',
    description: 'Obtiene la entrega asociada a un pedido específico'
  })
  @ApiParam({
    name: 'pedidoId',
    type: 'number',
    description: 'ID del pedido',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Entrega del pedido obtenida exitosamente',
    type: Entrega,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró entrega para el pedido'
  })
  async findByPedidoId(@Param('pedidoId', ParseIntPipe) pedidoId: number): Promise<Entrega> {
    return await this.entregasService.findByPedidoId(pedidoId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener entrega por ID',
    description: 'Obtiene una entrega específica con información del pedido y cliente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la entrega',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Entrega encontrada exitosamente',
    type: Entrega,
  })
  @ApiNotFoundResponse({
    description: 'Entrega no encontrada'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Entrega> {
    return await this.entregasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar entrega',
    description: 'Actualiza los datos de una entrega existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la entrega a actualizar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Entrega actualizada exitosamente',
    type: Entrega,
  })
  @ApiNotFoundResponse({
    description: 'Entrega no encontrada'
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEntregasDto: UpdateEntregasDto,
  ): Promise<Entrega> {
    return await this.entregasService.update(id, updateEntregasDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ 
    summary: 'Cambiar estado de la entrega',
    description: 'Cambia el estado de una entrega específica'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la entrega',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de la entrega actualizado exitosamente',
    type: Entrega,
  })
  @ApiNotFoundResponse({
    description: 'Entrega no encontrada'
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
  ): Promise<Entrega> {
    return await this.entregasService.changeStatus(id, body.estado);
  }

  @Patch(':id/completar')
  @ApiOperation({ 
    summary: 'Marcar entrega como completada',
    description: 'Marca una entrega como ENTREGADA y registra la hora de confirmación'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la entrega',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Entrega marcada como completada exitosamente',
    type: Entrega,
  })
  @ApiNotFoundResponse({
    description: 'Entrega no encontrada'
  })
  async markAsCompleted(@Param('id', ParseIntPipe) id: number): Promise<Entrega> {
    return await this.entregasService.markAsCompleted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar entrega',
    description: 'Elimina una entrega (solo si está PROGRAMADA o CANCELADA)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la entrega a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Entrega eliminada exitosamente'
  })
  @ApiNotFoundResponse({
    description: 'Entrega no encontrada'
  })
  @ApiConflictResponse({
    description: 'No se puede eliminar entrega (estado no permitido)'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.entregasService.remove(id);
  }
}