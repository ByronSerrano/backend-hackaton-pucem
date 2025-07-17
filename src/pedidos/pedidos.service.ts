import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ClientesService } from '../clientes/clientes.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly clientesService: ClientesService,
  ) {}

  /**
   * Crear un nuevo pedido
   */
  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    try {
      // Validar que el cliente existe
      await this.clientesService.findOne(createPedidoDto.clienteId);

      // Validar fecha del evento (no puede ser en el pasado)
      const fechaEvento = new Date(createPedidoDto.eventDate);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaEvento < hoy) {
        throw new BadRequestException('La fecha del evento no puede ser en el pasado');
      }

      // Validar cantidad de menús
      if (createPedidoDto.cantidadMenus <= 0) {
        throw new BadRequestException('La cantidad de menús debe ser mayor a 0');
      }

      // Validar número de personas
      if (createPedidoDto.numeroPersonas <= 0) {
        throw new BadRequestException('El número de personas debe ser mayor a 0');
      }

      // TODO: Validar que el menú existe y calcular total
      // const menu = await this.menusService.findOne(createPedidoDto.menuId);
      // const totalPedido = menu.precioUnitario * createPedidoDto.cantidadMenus;

      // Por ahora, calcular un total temporal
      const totalPedido = createPedidoDto.cantidadMenus * 50; // $50 por menú temporal

      // Crear nueva instancia
      const pedido = this.pedidoRepository.create({
        ...createPedidoDto,
        totalPedido,
        estado: createPedidoDto.estado || 'PENDIENTE'
      });
      
      // Guardar en base de datos
      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el pedido');
    }
  }

  /**
   * Obtener todos los pedidos
   */
  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      relations: ['cliente'],
      order: {
        orderedAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pedidos por estado
   */
  async findByStatus(estado: string): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      where: { estado },
      relations: ['cliente'],
      order: {
        eventDate: 'ASC'
      }
    });
  }

  /**
   * Obtener pedidos de un cliente
   */
  async findByCliente(clienteId: number): Promise<Pedido[]> {
    // Validar que el cliente existe
    await this.clientesService.findOne(clienteId);

    return await this.pedidoRepository.find({
      where: { clienteId },
      relations: ['cliente'],
      order: {
        orderedAt: 'DESC'
      }
    });
  }

  /**
   * Obtener pedidos por rango de fechas de evento
   */
  async findByEventDateRange(fechaInicio: string, fechaFin: string): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      where: {
        eventDate: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: ['cliente'],
      order: {
        eventDate: 'ASC'
      }
    });
  }

  /**
   * Obtener pedidos del día
   */
  async findToday(): Promise<Pedido[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    return await this.pedidoRepository.find({
      where: {
        eventDate: Between(hoy, mañana)
      },
      relations: ['cliente'],
      order: {
        eventTime: 'ASC'
      }
    });
  }

  /**
   * Obtener un pedido por ID
   */
  async findOne(id: number): Promise<Pedido> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID del pedido debe ser un número válido');
    }

    const pedido = await this.pedidoRepository.findOne({
      where: { pedidoId: id },
      relations: ['cliente']
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  /**
   * Actualizar un pedido
   */
  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    // Verificar que el pedido existe
    const pedido = await this.findOne(id);

    // Validar cliente si se está actualizando
    if (updatePedidoDto.clienteId) {
      await this.clientesService.findOne(updatePedidoDto.clienteId);
    }

    // Validar fecha del evento si se está actualizando
    if (updatePedidoDto.eventDate) {
      const fechaEvento = new Date(updatePedidoDto.eventDate);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaEvento < hoy) {
        throw new BadRequestException('La fecha del evento no puede ser en el pasado');
      }
    }

    // Validar cantidades
    if (updatePedidoDto.cantidadMenus && updatePedidoDto.cantidadMenus <= 0) {
      throw new BadRequestException('La cantidad de menús debe ser mayor a 0');
    }

    if (updatePedidoDto.numeroPersonas && updatePedidoDto.numeroPersonas <= 0) {
      throw new BadRequestException('El número de personas debe ser mayor a 0');
    }

    try {
      // Recalcular total si cambia la cantidad de menús
      if (updatePedidoDto.cantidadMenus) {
        // TODO: Obtener precio real del menú
        updatePedidoDto['totalPedido'] = updatePedidoDto.cantidadMenus * 50;
      }

      // Actualizar campos
      Object.assign(pedido, updatePedidoDto);
      
      // Guardar cambios
      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el pedido');
    }
  }

  /**
   * Cambiar estado del pedido
   */
  async changeStatus(id: number, nuevoEstado: string): Promise<Pedido> {
    const estadosValidos = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
    }

    const pedido = await this.findOne(id);
    
    // Validaciones de transición de estado
    if (pedido.estado === 'CANCELADO' && nuevoEstado !== 'PENDIENTE') {
      throw new ConflictException('No se puede cambiar el estado de un pedido cancelado');
    }
    
    if (pedido.estado === 'ENTREGADO' && nuevoEstado !== 'ENTREGADO') {
      throw new ConflictException('No se puede cambiar el estado de un pedido ya entregado');
    }

    pedido.estado = nuevoEstado;
    return await this.pedidoRepository.save(pedido);
  }

  /**
   * Eliminar un pedido
   */
  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    
    // Solo permitir eliminar pedidos pendientes
    if (pedido.estado !== 'PENDIENTE') {
      throw new ConflictException('Solo se pueden eliminar pedidos en estado PENDIENTE');
    }

    try {
      await this.pedidoRepository.remove(pedido);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el pedido');
    }
  }

  /**
   * Contar pedidos por estado
   */
  async countByStatus(): Promise<Record<string, number>> {
    const estados = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];
    const resultado = {};

    for (const estado of estados) {
      resultado[estado] = await this.pedidoRepository.count({ where: { estado } });
    }

    return resultado;
  }

  /**
   * Obtener estadísticas generales
   */
  async getStats() {
    const total = await this.pedidoRepository.count();
    
    // Calcular pedidos de hoy correctamente
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const pedidosHoy = await this.pedidoRepository.count({
      where: { 
        eventDate: Between(hoy, mañana)
      }
    });

    const totalIngresos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select('SUM(pedido.totalPedido)', 'total')
      .where('pedido.estado != :estado', { estado: 'CANCELADO' })
      .getRawOne();

    const porEstado = await this.countByStatus();

    return {
      totalPedidos: total,
      pedidosHoy,
      totalIngresos: parseFloat(totalIngresos?.total || '0'),
      porEstado
    };
  }
}