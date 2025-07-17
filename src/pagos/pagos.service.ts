import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PedidosService } from '../pedidos/pedidos.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    private readonly pedidosService: PedidosService,
  ) {}

  /**
   * Registrar un nuevo pago
   */
  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    try {
      // Validar que el pedido existe
      const pedido = await this.pedidosService.findOne(createPagoDto.pedidoId);

      // Validar monto positivo
      if (createPagoDto.monto <= 0) {
        throw new BadRequestException('El monto del pago debe ser mayor a 0');
      }

      // Validar método de pago
      const metodosValidos = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE'];
      if (!metodosValidos.includes(createPagoDto.metodoPago)) {
        throw new BadRequestException(`Método de pago inválido. Métodos válidos: ${metodosValidos.join(', ')}`);
      }

      // Validar estado si se proporciona
      if (createPagoDto.estadoPago) {
        const estadosValidos = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'];
        if (!estadosValidos.includes(createPagoDto.estadoPago)) {
          throw new BadRequestException(`Estado de pago inválido. Estados válidos: ${estadosValidos.join(', ')}`);
        }
      }

      // Verificar que el monto no exceda el total del pedido
      const totalPagado = await this.getTotalPagadoPorPedido(createPagoDto.pedidoId);
      const nuevoTotal = totalPagado + createPagoDto.monto;
      
      if (nuevoTotal > pedido.totalPedido) {
        throw new BadRequestException(
          `El monto total de pagos ($${nuevoTotal}) excedería el total del pedido ($${pedido.totalPedido})`
        );
      }

      // Crear nueva instancia
      const pago = this.pagoRepository.create({
        ...createPagoDto,
        estadoPago: createPagoDto.estadoPago || 'PENDIENTE'
      });
      
      // Guardar en base de datos
      return await this.pagoRepository.save(pago);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al registrar el pago');
    }
  }

  /**
   * Obtener todos los pagos
   */
  async findAll(): Promise<Pago[]> {
    return await this.pagoRepository.find({
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pagos por estado
   */
  async findByStatus(estado: string): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { estadoPago: estado },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pagos por método de pago
   */
  async findByMetodo(metodo: string): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { metodoPago: metodo },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pagos de un pedido específico
   */
  async findByPedido(pedidoId: number): Promise<Pago[]> {
    // Validar que el pedido existe
    await this.pedidosService.findOne(pedidoId);

    return await this.pagoRepository.find({
      where: { pedidoId },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'ASC'
      }
    });
  }

  /**
   * Obtener pagos por rango de fechas
   */
  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: {
        paidAt: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pagos del día
   */
  async findToday(): Promise<Pago[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    return await this.pagoRepository.find({
      where: {
        paidAt: Between(hoy, mañana)
      },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        paidAt: 'DESC'
      }
    });
  }

  /**
   * Obtener un pago por ID
   */
  async findOne(id: number): Promise<Pago> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID del pago debe ser un número válido');
    }

    const pago = await this.pagoRepository.findOne({
      where: { pagoId: id },
      relations: ['pedido', 'pedido.cliente']
    });

    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return pago;
  }

  /**
   * Actualizar un pago
   */
  async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    // Verificar que el pago existe
    const pago = await this.findOne(id);

    // Validar nuevo pedido si se está actualizando
    if (updatePagoDto.pedidoId && updatePagoDto.pedidoId !== pago.pedidoId) {
      await this.pedidosService.findOne(updatePagoDto.pedidoId);
    }

    // Validar nuevo monto si se está actualizando
    if (updatePagoDto.monto && updatePagoDto.monto <= 0) {
      throw new BadRequestException('El monto del pago debe ser mayor a 0');
    }

    // Validar método de pago si se está actualizando
    if (updatePagoDto.metodoPago) {
      const metodosValidos = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE'];
      if (!metodosValidos.includes(updatePagoDto.metodoPago)) {
        throw new BadRequestException(`Método de pago inválido. Métodos válidos: ${metodosValidos.join(', ')}`);
      }
    }

    // Validar estado de pago si se está actualizando
    if (updatePagoDto.estadoPago) {
      const estadosValidos = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'];
      if (!estadosValidos.includes(updatePagoDto.estadoPago)) {
        throw new BadRequestException(`Estado de pago inválido. Estados válidos: ${estadosValidos.join(', ')}`);
      }
    }

    try {
      // Actualizar campos
      Object.assign(pago, updatePagoDto);
      
      // Guardar cambios
      return await this.pagoRepository.save(pago);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el pago');
    }
  }

  /**
   * Cambiar estado del pago
   */
  async changeStatus(id: number, nuevoEstado: string): Promise<Pago> {
    const estadosValidos = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
    }

    const pago = await this.findOne(id);
    
    // Validaciones de transición de estado
    if (pago.estadoPago === 'COMPLETADO' && nuevoEstado !== 'REEMBOLSADO') {
      throw new ConflictException('Un pago completado solo puede cambiar a REEMBOLSADO');
    }
    
    if (pago.estadoPago === 'REEMBOLSADO' && nuevoEstado !== 'REEMBOLSADO') {
      throw new ConflictException('Un pago reembolsado no puede cambiar de estado');
    }

    pago.estadoPago = nuevoEstado;
    return await this.pagoRepository.save(pago);
  }

  /**
   * Marcar pago como completado
   */
  async markAsCompleted(id: number): Promise<Pago> {
    const pago = await this.findOne(id);
    
    if (pago.estadoPago === 'COMPLETADO') {
      throw new ConflictException('El pago ya está marcado como completado');
    }
    
    if (pago.estadoPago === 'REEMBOLSADO') {
      throw new ConflictException('No se puede completar un pago reembolsado');
    }

    pago.estadoPago = 'COMPLETADO';
    return await this.pagoRepository.save(pago);
  }

  /**
   * Eliminar un pago
   */
  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    
    // Solo permitir eliminar pagos pendientes o fallidos
    if (!['PENDIENTE', 'FALLIDO'].includes(pago.estadoPago)) {
      throw new ConflictException('Solo se pueden eliminar pagos en estado PENDIENTE o FALLIDO');
    }

    try {
      await this.pagoRepository.remove(pago);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el pago');
    }
  }

  /**
   * Obtener total pagado por un pedido
   */
  async getTotalPagadoPorPedido(pedidoId: number): Promise<number> {
    const resultado = await this.pagoRepository
      .createQueryBuilder('pago')
      .select('SUM(pago.monto)', 'total')
      .where('pago.pedidoId = :pedidoId', { pedidoId })
      .andWhere('pago.estadoPago = :estado', { estado: 'COMPLETADO' })
      .getRawOne();

    return parseFloat(resultado?.total || '0');
  }

  /**
   * Obtener resumen de pagos por pedido
   */
  async getResumenPorPedido(pedidoId: number) {
    const pedido = await this.pedidosService.findOne(pedidoId);
    const pagos = await this.findByPedido(pedidoId);
    
    const totalPagado = await this.getTotalPagadoPorPedido(pedidoId);
    const saldoPendiente = pedido.totalPedido - totalPagado;
    
    return {
      pedidoId,
      totalPedido: pedido.totalPedido,
      totalPagado,
      saldoPendiente,
      porcentajePagado: Math.round((totalPagado / pedido.totalPedido) * 100),
      cantidadPagos: pagos.length,
      pagos: pagos
    };
  }

  /**
   * Contar pagos por estado
   */
  async countByStatus(): Promise<Record<string, number>> {
    const estados = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'];
    const resultado = {};

    for (const estado of estados) {
      resultado[estado] = await this.pagoRepository.count({ where: { estadoPago: estado } });
    }

    return resultado;
  }

  /**
   * Contar pagos por método
   */
  async countByMetodo(): Promise<Record<string, number>> {
    const metodos = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE'];
    const resultado = {};

    for (const metodo of metodos) {
      resultado[metodo] = await this.pagoRepository.count({ where: { metodoPago: metodo } });
    }

    return resultado;
  }

  /**
   * Obtener estadísticas de pagos
   */
  async getStats() {
    const total = await this.pagoRepository.count();
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const pagosHoy = await this.pagoRepository.count({
      where: { 
        paidAt: Between(hoy, mañana)
      }
    });

    const totalIngresos = await this.pagoRepository
      .createQueryBuilder('pago')
      .select('SUM(pago.monto)', 'total')
      .where('pago.estadoPago = :estado', { estado: 'COMPLETADO' })
      .getRawOne();

    const ingresosHoy = await this.pagoRepository
      .createQueryBuilder('pago')
      .select('SUM(pago.monto)', 'total')
      .where('pago.estadoPago = :estado', { estado: 'COMPLETADO' })
      .andWhere('pago.paidAt >= :hoy', { hoy })
      .andWhere('pago.paidAt < :mañana', { mañana })
      .getRawOne();

    const porEstado = await this.countByStatus();
    const porMetodo = await this.countByMetodo();

    return {
      totalPagos: total,
      pagosHoy,
      totalIngresos: parseFloat(totalIngresos?.total || '0'),
      ingresosHoy: parseFloat(ingresosHoy?.total || '0'),
      porEstado,
      porMetodo
    };
  }
}