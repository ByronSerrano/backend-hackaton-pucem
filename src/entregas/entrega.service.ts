import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Entrega } from './entities/entrega.entity';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregasDto } from './dto/update-entrega.dto';
import { PedidosService } from '../pedidos/pedidos.service';

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly pedidosService: PedidosService,
  ) {}

  /**
   * Crear una nueva entrega
   */
  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    try {
      // Validar que el pedido existe
      const pedido = await this.pedidosService.findOne(createEntregaDto.pedidoId);

      // Verificar que el pedido no tenga ya una entrega
      const entregaExistente = await this.entregaRepository.findOne({
        where: { pedidoId: createEntregaDto.pedidoId }
      });

      if (entregaExistente) {
        throw new ConflictException(`El pedido ${createEntregaDto.pedidoId} ya tiene una entrega programada`);
      }

      // Validar fecha de entrega (no puede ser anterior a la fecha del evento)
      const fechaEntrega = new Date(createEntregaDto.deliveryDate);
      const fechaEvento = new Date(pedido.eventDate);
      
      if (fechaEntrega > fechaEvento) {
        throw new BadRequestException('La fecha de entrega no puede ser posterior a la fecha del evento');
      }

      // Validar que la fecha de entrega no sea en el pasado
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaEntrega < hoy) {
        throw new BadRequestException('La fecha de entrega no puede ser en el pasado');
      }

      // Validar horarios si se proporciona endTime
      if (createEntregaDto.endTime) {
        const horaInicio = new Date(`2000-01-01T${createEntregaDto.startTime}`);
        const horaFin = new Date(`2000-01-01T${createEntregaDto.endTime}`);
        
        if (horaFin <= horaInicio) {
          throw new BadRequestException('La hora de finalización debe ser posterior a la hora de inicio');
        }
      }

      // Crear nueva instancia
      const entrega = this.entregaRepository.create({
        ...createEntregaDto,
        estadoEntrega: createEntregaDto.estadoEntrega || 'PROGRAMADA'
      });
      
      // Guardar en base de datos
      return await this.entregaRepository.save(entrega);
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la entrega');
    }
  }

  /**
   * Obtener todas las entregas
   */
  async findAll(): Promise<Entrega[]> {
    return await this.entregaRepository.find({
      relations: ['pedido', 'pedido.cliente'],
      order: {
        deliveryDate: 'ASC',
        startTime: 'ASC'
      }
    });
  }

  /**
   * Obtener entregas por estado
   */
  async findByStatus(estado: string): Promise<Entrega[]> {
    return await this.entregaRepository.find({
      where: { estadoEntrega: estado },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        deliveryDate: 'ASC',
        startTime: 'ASC'
      }
    });
  }

  /**
   * Obtener entregas del día
   */
  async findToday(): Promise<Entrega[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    return await this.entregaRepository.find({
      where: {
        deliveryDate: Between(hoy, mañana)
      },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        startTime: 'ASC'
      }
    });
  }

  /**
   * Obtener entregas por rango de fechas
   */
  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Entrega[]> {
    return await this.entregaRepository.find({
      where: {
        deliveryDate: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        deliveryDate: 'ASC',
        startTime: 'ASC'
      }
    });
  }

  /**
   * Obtener entregas por conductor
   */
  async findByConductor(conductor: string): Promise<Entrega[]> {
    return await this.entregaRepository.find({
      where: { conductor },
      relations: ['pedido', 'pedido.cliente'],
      order: {
        deliveryDate: 'ASC',
        startTime: 'ASC'
      }
    });
  }

  /**
   * Obtener entrega por ID de pedido
   */
  async findByPedidoId(pedidoId: number): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({
      where: { pedidoId },
      relations: ['pedido', 'pedido.cliente']
    });

    if (!entrega) {
      throw new NotFoundException(`No se encontró entrega para el pedido ${pedidoId}`);
    }

    return entrega;
  }

  /**
   * Obtener una entrega por ID
   */
  async findOne(id: number): Promise<Entrega> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de la entrega debe ser un número válido');
    }

    const entrega = await this.entregaRepository.findOne({
      where: { entregaId: id },
      relations: ['pedido', 'pedido.cliente']
    });

    if (!entrega) {
      throw new NotFoundException(`Entrega con ID ${id} no encontrada`);
    }

    return entrega;
  }

  /**
   * Actualizar una entrega
   */
  async update(id: number, updateEntregaDto: UpdateEntregasDto): Promise<Entrega> {
    // Verificar que la entrega existe
    const entrega = await this.findOne(id);

    // Validar nuevo pedido si se está actualizando
    if (updateEntregaDto.pedidoId && updateEntregaDto.pedidoId !== entrega.pedidoId) {
      await this.pedidosService.findOne(updateEntregaDto.pedidoId);
      
      // Verificar que el nuevo pedido no tenga ya una entrega
      const entregaExistente = await this.entregaRepository.findOne({
        where: { pedidoId: updateEntregaDto.pedidoId }
      });
      
      if (entregaExistente) {
        throw new ConflictException(`El pedido ${updateEntregaDto.pedidoId} ya tiene una entrega programada`);
      }
    }

    // Validar fechas si se están actualizando
    if (updateEntregaDto.deliveryDate) {
      const fechaEntrega = new Date(updateEntregaDto.deliveryDate);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaEntrega < hoy) {
        throw new BadRequestException('La fecha de entrega no puede ser en el pasado');
      }
    }

    // Validar horarios si se están actualizando
    if (updateEntregaDto.startTime && updateEntregaDto.endTime) {
      const horaInicio = new Date(`2000-01-01T${updateEntregaDto.startTime}`);
      const horaFin = new Date(`2000-01-01T${updateEntregaDto.endTime}`);
      
      if (horaFin <= horaInicio) {
        throw new BadRequestException('La hora de finalización debe ser posterior a la hora de inicio');
      }
    }

    try {
      // Actualizar campos
      Object.assign(entrega, updateEntregaDto);
      
      // Guardar cambios
      return await this.entregaRepository.save(entrega);
    } catch (error) {
      throw new BadRequestException('Error al actualizar la entrega');
    }
  }

  /**
   * Cambiar estado de la entrega
   */
  async changeStatus(id: number, nuevoEstado: string): Promise<Entrega> {
    const estadosValidos = ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
    }

    const entrega = await this.findOne(id);
    
    // Validaciones de transición de estado
    if (entrega.estadoEntrega === 'ENTREGADA' && nuevoEstado !== 'ENTREGADA') {
      throw new ConflictException('No se puede cambiar el estado de una entrega ya completada');
    }
    
    if (entrega.estadoEntrega === 'CANCELADA' && nuevoEstado !== 'PROGRAMADA') {
      throw new ConflictException('Una entrega cancelada solo puede volver a PROGRAMADA');
    }

    entrega.estadoEntrega = nuevoEstado;
    
    // Si se marca como entregada, registrar fecha de confirmación
    if (nuevoEstado === 'ENTREGADA') {
      entrega.confirmedAt = new Date();
    }

    return await this.entregaRepository.save(entrega);
  }

  /**
   * Marcar entrega como completada
   */
  async markAsCompleted(id: number): Promise<Entrega> {
    const entrega = await this.findOne(id);
    
    entrega.estadoEntrega = 'ENTREGADA';
    entrega.confirmedAt = new Date();
    
    // Si no tiene hora de finalización, usar la hora actual
    if (!entrega.endTime) {
      const ahora = new Date();
      entrega.endTime = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:00`;
    }

    return await this.entregaRepository.save(entrega);
  }

  /**
   * Eliminar una entrega
   */
  async remove(id: number): Promise<void> {
    const entrega = await this.findOne(id);
    
    // Solo permitir eliminar entregas programadas o canceladas
    if (!['PROGRAMADA', 'CANCELADA'].includes(entrega.estadoEntrega)) {
      throw new ConflictException('Solo se pueden eliminar entregas en estado PROGRAMADA o CANCELADA');
    }

    try {
      await this.entregaRepository.remove(entrega);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la entrega');
    }
  }

  /**
   * Contar entregas por estado
   */
  async countByStatus(): Promise<Record<string, number>> {
    const estados = ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA'];
    const resultado = {};

    for (const estado of estados) {
      resultado[estado] = await this.entregaRepository.count({ where: { estadoEntrega: estado } });
    }

    return resultado;
  }

  /**
   * Obtener estadísticas de entregas
   */
  async getStats() {
    const total = await this.entregaRepository.count();
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const entregasHoy = await this.entregaRepository.count({
      where: { 
        deliveryDate: Between(hoy, mañana)
      }
    });

    const completadas = await this.entregaRepository.count({
      where: { estadoEntrega: 'ENTREGADA' }
    });

    const porEstado = await this.countByStatus();

    return {
      totalEntregas: total,
      entregasHoy,
      completadas,
      tasaCompletado: total > 0 ? Math.round((completadas / total) * 100) : 0,
      porEstado
    };
  }
}