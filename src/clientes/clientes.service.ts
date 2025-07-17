import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  /**
   * Crear un nuevo cliente
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      // Verificar si el email ya existe (si se proporciona)
      if (createClienteDto.email) {
        const existingClient = await this.clienteRepository.findOne({
          where: { email: createClienteDto.email }
        });
        
        if (existingClient) {
          throw new ConflictException(`Ya existe un cliente con el email: ${createClienteDto.email}`);
        }
      }

      // Crear nueva instancia
      const cliente = this.clienteRepository.create(createClienteDto);
      
      // Guardar en base de datos
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el cliente');
    }
  }

  /**
   * Obtener todos los clientes
   */
  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  /**
   * Obtener solo clientes activos
   */
  async findActive(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: { estado: true },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  /**
   * Obtener un cliente por ID
   */
  async findOne(id: number): Promise<Cliente> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID del cliente debe ser un número válido');
    }

    const cliente = await this.clienteRepository.findOne({
      where: { clienteId: id }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  /**
   * Buscar cliente por email
   */
  async findByEmail(email: string): Promise<Cliente> {
    if (!email) {
      throw new BadRequestException('Email es requerido');
    }

    const cliente = await this.clienteRepository.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con email ${email} no encontrado`);
    }

    return cliente;
  }

  /**
   * Buscar clientes por ciudad
   */
  async findByCity(ciudad: string): Promise<Cliente[]> {
    if (!ciudad) {
      throw new BadRequestException('Ciudad es requerida');
    }

    return await this.clienteRepository.find({
      where: { ciudad: ciudad.trim() },
      order: {
        nombre: 'ASC'
      }
    });
  }

  /**
   * Actualizar un cliente
   */
  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    // Verificar que el cliente existe
    const cliente = await this.findOne(id);

    // Verificar email único si se está actualizando
    if (updateClienteDto.email && updateClienteDto.email !== cliente.email) {
      const existingClient = await this.clienteRepository.findOne({
        where: { email: updateClienteDto.email }
      });
      
      if (existingClient) {
        throw new ConflictException(`Ya existe un cliente con el email: ${updateClienteDto.email}`);
      }
    }

    try {
      // Actualizar campos
      Object.assign(cliente, updateClienteDto);
      
      // Guardar cambios
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el cliente');
    }
  }

  /**
   * Desactivar un cliente (soft delete)
   */
  async deactivate(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    
    cliente.estado = false;
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Activar un cliente
   */
  async activate(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    
    cliente.estado = true;
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Eliminar completamente un cliente (hard delete)
   */
  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    
    try {
      await this.clienteRepository.remove(cliente);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el cliente. Puede tener pedidos asociados.');
    }
  }

  /**
   * Contar total de clientes
   */
  async count(): Promise<number> {
    return await this.clienteRepository.count();
  }

  /**
   * Contar clientes activos
   */
  async countActive(): Promise<number> {
    return await this.clienteRepository.count({
      where: { estado: true }
    });
  }

  /**
   * Buscar clientes por término de búsqueda (nombre, apellido, email)
   */
  async search(searchTerm: string): Promise<Cliente[]> {
    if (!searchTerm || searchTerm.length < 2) {
      throw new BadRequestException('Término de búsqueda debe tener al menos 2 caracteres');
    }

    const term = `%${searchTerm.toLowerCase()}%`;

    return await this.clienteRepository
      .createQueryBuilder('cliente')
      .where('LOWER(cliente.nombre) LIKE :term', { term })
      .orWhere('LOWER(cliente.apellido) LIKE :term', { term })
      .orWhere('LOWER(cliente.email) LIKE :term', { term })
      .orderBy('cliente.nombre', 'ASC')
      .getMany();
  }
}