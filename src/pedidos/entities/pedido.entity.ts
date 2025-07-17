import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('PEDIDOS')
export class Pedido {
  @ApiProperty({
    description: 'ID único del pedido',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'pedido_id' })
  pedidoId: number;

  @ApiProperty({
    description: 'ID del cliente que realiza el pedido',
    example: 1
  })
  @Column({ name: 'cliente_id', type: 'int', nullable: false })
  clienteId: number;

  @ApiProperty({
    description: 'ID del menú solicitado',
    example: 1
  })
  @Column({ name: 'menu_id', type: 'int', nullable: false })
  menuId: number;

  @ApiProperty({
    description: 'Fecha y hora cuando se realizó el pedido',
    example: '2025-07-17T14:30:00Z'
  })
  @CreateDateColumn({ 
    name: 'ordered_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  orderedAt: Date;

  @ApiProperty({
    description: 'Fecha del evento',
    example: '2025-07-20'
  })
  @Column({ name: 'event_date', type: 'date', nullable: false })
  eventDate: Date;

  @ApiProperty({
    description: 'Hora del evento',
    example: '18:30:00'
  })
  @Column({ name: 'event_time', type: 'time', nullable: false })
  eventTime: string;

  @ApiProperty({
    description: 'Estado actual del pedido',
    example: 'PENDIENTE',
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO']
  })
  @Column({ 
    type: 'varchar', 
    default: 'PENDIENTE',
    length: 20
  })
  estado: string;

  @ApiProperty({
    description: 'Cantidad de menús solicitados',
    example: 3,
    minimum: 1
  })
  @Column({ name: 'cantidad_menus', type: 'int', nullable: false, default: 1 })
  cantidadMenus: number;

  @ApiProperty({
    description: 'Total del pedido en dólares',
    example: 150.50
  })
  @Column({ 
    name: 'total_pedido', 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    default: 0 
  })
  totalPedido: number;

  @ApiProperty({
    description: 'Número de personas para el evento',
    example: 25
  })
  @Column({ name: 'numero_personas', type: 'int', nullable: false })
  numeroPersonas: number;

  @ApiProperty({
    description: 'Observaciones adicionales del pedido',
    example: 'Sin cebolla en las ensaladas, evento al aire libre',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ApiProperty({
    description: 'Dirección donde se realizará el evento',
    example: 'Av. Manabí 456, Salón Los Jardines'
  })
  @Column({ name: 'direccion_evento', type: 'text', nullable: false })
  direccionEvento: string;

  @ApiProperty({
    description: 'Teléfono de contacto para el evento',
    example: '+593999654321',
    required: false
  })
  @Column({ name: 'telefono_contacto', type: 'varchar', nullable: true })
  telefonoContacto: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-07-17T14:30:00Z'
  })
  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  // Relaciones
  @ApiProperty({
    description: 'Información del cliente que realiza el pedido',
    type: () => Cliente
  })
  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // NO incluimos relación con Menu para evitar dependencia circular
  // La información del menú se puede obtener usando MenusService.findOne(menuId)

  // Propiedades virtuales
  @ApiProperty({
    description: 'Fecha y hora completa del evento',
    example: '2025-07-20T18:30:00Z'
  })
  get eventoDateTime(): string | null {
    if (this.eventDate && this.eventTime) {
      return `${this.eventDate}T${this.eventTime}`;
    }
    return null;
  }

  @ApiProperty({
    description: 'Número de días hasta el evento',
    example: 3
  })
  get diasHastaEvento(): number | null {
    if (this.eventDate) {
      const hoy = new Date();
      const fechaEvento = new Date(this.eventDate);
      const diferencia = fechaEvento.getTime() - hoy.getTime();
      return Math.ceil(diferencia / (1000 * 3600 * 24));
    }
    return null;
  }
}