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
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Registrar nuevo pago',
    description: 'Registra un nuevo pago asociado a un pedido'
  })
  @ApiResponse({
    status: 201,
    description: 'Pago registrado exitosamente',
    type: Pago,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o pedido no existe'
  })
  async create(@Body() createPagoDto: CreatePagoDto): Promise<Pago> {
    return await this.pagosService.create(createPagoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los pagos',
    description: 'Obtiene la lista completa de pagos con información del pedido y cliente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos obtenida exitosamente',
    type: [Pago],
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    type: 'string',
    description: 'Filtrar por estado del pago',
    enum: ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO']
  })
  @ApiQuery({
    name: 'metodo',
    required: false,
    type: 'string',
    description: 'Filtrar por método de pago',
    enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE']
  })
  async findAll(
    @Query('estado') estado?: string,
    @Query('metodo') metodo?: string,
  ): Promise<Pago[]> {
    if (estado) {
      return await this.pagosService.findByStatus(estado);
    }
    if (metodo) {
      return await this.pagosService.findByMetodo(metodo);
    }
    return await this.pagosService.findAll();
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Estadísticas de pagos',
    description: 'Obtiene estadísticas generales de pagos e ingresos'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalPagos: { type: 'number', example: 250 },
        pagosHoy: { type: 'number', example: 12 },
        totalIngresos: { type: 'number', example: 15750.50 },
        ingresosHoy: { type: 'number', example: 850.00 },
        porEstado: {
          type: 'object',
          properties: {
            PENDIENTE: { type: 'number', example: 15 },
            PROCESANDO: { type: 'number', example: 8 },
            COMPLETADO: { type: 'number', example: 200 },
            FALLIDO: { type: 'number', example: 12 },
            REEMBOLSADO: { type: 'number', example: 15 }
          }
        },
        porMetodo: {
          type: 'object',
          properties: {
            EFECTIVO: { type: 'number', example: 80 },
            TARJETA: { type: 'number', example: 120 },
            TRANSFERENCIA: { type: 'number', example: 40 },
            CHEQUE: { type: 'number', example: 10 }
          }
        }
      }
    }
  })
  async getStats() {
    return await this.pagosService.getStats();
  }

  @Get('hoy')
  @ApiOperation({ 
    summary: 'Pagos de hoy',
    description: 'Obtiene todos los pagos registrados el día de hoy'
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos de hoy obtenidos exitosamente',
    type: [Pago],
  })
  async findToday(): Promise<Pago[]> {
    return await this.pagosService.findToday();
  }

  @Get('pedido/:pedidoId')
  @ApiOperation({ 
    summary: 'Pagos por pedido',
    description: 'Obtiene todos los pagos de un pedido específico'
  })
  @ApiParam({
    name: 'pedidoId',
    type: 'number',
    description: 'ID del pedido',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos del pedido obtenidos exitosamente',
    type: [Pago],
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado'
  })
  async findByPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number): Promise<Pago[]> {
    return await this.pagosService.findByPedido(pedidoId);
  }

  @Get('pedido/:pedidoId/resumen')
  @ApiOperation({ 
    summary: 'Resumen de pagos por pedido',
    description: 'Obtiene un resumen completo de pagos y saldos de un pedido'
  })
  @ApiParam({
    name: 'pedidoId',
    type: 'number',
    description: 'ID del pedido',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de pagos obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        pedidoId: { type: 'number', example: 1 },
        totalPedido: { type: 'number', example: 500.00 },
        totalPagado: { type: 'number', example: 300.00 },
        saldoPendiente: { type: 'number', example: 200.00 },
        porcentajePagado: { type: 'number', example: 60 },
        cantidadPagos: { type: 'number', example: 2 },
        pagos: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  async getResumenPorPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number) {
    return await this.pagosService.getResumenPorPedido(pedidoId);
  }

  @Get('rango-fechas')
  @ApiOperation({ 
    summary: 'Pagos por rango de fechas',
    description: 'Obtiene pagos en un rango de fechas específico'
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
    description: 'Pagos en el rango obtenidos exitosamente',
    type: [Pago],
  })
  @ApiBadRequestResponse({
    description: 'Fechas inválidas'
  })
  async findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ): Promise<Pago[]> {
    return await this.pagosService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get('estado/:estado')
  @ApiOperation({ 
    summary: 'Pagos por estado',
    description: 'Obtiene todos los pagos con un estado específico'
  })
  @ApiParam({
    name: 'estado',
    type: 'string',
    description: 'Estado del pago',
    enum: ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'],
    example: 'COMPLETADO'
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos por estado obtenidos exitosamente',
    type: [Pago],
  })
  async findByStatus(@Param('estado') estado: string): Promise<Pago[]> {
    return await this.pagosService.findByStatus(estado);
  }

  @Get('metodo/:metodo')
  @ApiOperation({ 
    summary: 'Pagos por método',
    description: 'Obtiene todos los pagos con un método de pago específico'
  })
  @ApiParam({
    name: 'metodo',
    type: 'string',
    description: 'Método de pago',
    enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE'],
    example: 'TARJETA'
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos por método obtenidos exitosamente',
    type: [Pago],
  })
  async findByMetodo(@Param('metodo') metodo: string): Promise<Pago[]> {
    return await this.pagosService.findByMetodo(metodo);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener pago por ID',
    description: 'Obtiene un pago específico con información del pedido y cliente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pago',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pago encontrado exitosamente',
    type: Pago,
  })
  @ApiNotFoundResponse({
    description: 'Pago no encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return await this.pagosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar pago',
    description: 'Actualiza los datos de un pago existente'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pago a actualizar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado exitosamente',
    type: Pago,
  })
  @ApiNotFoundResponse({
    description: 'Pago no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos proporcionados'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagoDto: UpdatePagoDto,
  ): Promise<Pago> {
    return await this.pagosService.update(id, updatePagoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ 
    summary: 'Cambiar estado del pago',
    description: 'Cambia el estado de un pago específico'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pago',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del pago actualizado exitosamente',
    type: Pago,
  })
  @ApiNotFoundResponse({
    description: 'Pago no encontrado'
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
  ): Promise<Pago> {
    return await this.pagosService.changeStatus(id, body.estado);
  }

  @Patch(':id/completar')
  @ApiOperation({ 
    summary: 'Marcar pago como completado',
    description: 'Marca un pago como COMPLETADO'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pago',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Pago marcado como completado exitosamente',
    type: Pago,
  })
  @ApiNotFoundResponse({
    description: 'Pago no encontrado'
  })
  @ApiConflictResponse({
    description: 'El pago ya está completado o reembolsado'
  })
  async markAsCompleted(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return await this.pagosService.markAsCompleted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar pago',
    description: 'Elimina un pago (solo si está PENDIENTE o FALLIDO)'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID del pago a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Pago eliminado exitosamente'
  })
  @ApiNotFoundResponse({
    description: 'Pago no encontrado'
  })
  @ApiConflictResponse({
    description: 'No se puede eliminar pago (estado no permitido)'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.pagosService.remove(id);
  }
}