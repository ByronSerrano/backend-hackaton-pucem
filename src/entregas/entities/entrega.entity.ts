import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity('ENTREGAS')
export class Entrega {
  @ApiProperty({
    description: 'ID único de la entrega',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'entrega_id' })
  entregaId: number;

  @ApiProperty({
    description: 'ID del pedido asociado',
    example: 1
  })
  @Column({ name: 'pedido_id', type: 'int', nullable: false, unique: true })
  pedidoId: number;

  @ApiProperty({
    description: 'Fecha programada para la entrega',
    example: '2025-07-20'
  })
  @Column({ name: 'delivery_date', type: 'date', nullable: false })
  deliveryDate: Date;

  @ApiProperty({
    description: 'Hora de inicio programada',
    example: '17:00:00'
  })
  @Column({ name: 'start_time', type: 'time', nullable: false })
  startTime: string;

  @ApiProperty({
    description: 'Hora de finalización',
    example: '19:30:00',
    required: false
  })
  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @ApiProperty({
    description: 'Estado de la entrega',
    example: 'PROGRAMADA',
    enum: ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA']
  })
  @Column({ 
    name: 'estado_entrega',
    type: 'varchar', 
    default: 'PROGRAMADA',
    length: 20
  })
  estadoEntrega: string;

  @ApiProperty({
    description: 'Vehículo asignado para la entrega',
    example: 'Camión Toyota - Placa ABC-123',
    required: false
  })
  @Column({ type: 'varchar', nullable: true })
  vehiculo: string;

  @ApiProperty({
    description: 'Conductor asignado',
    example: 'Carlos Mendoza',
    required: false
  })
  @Column({ type: 'varchar', nullable: true })
  conductor: string;

  @ApiProperty({
    description: 'Notas adicionales de la entrega',
    example: 'Confirmar acceso al edificio con portería',
    required: false
  })
  @Column({ name: 'notas_entrega', type: 'text', nullable: true })
  notasEntrega: string;

  @ApiProperty({
    description: 'Fecha y hora de confirmación de entrega',
    example: '2025-07-20T19:45:00Z',
    required: false
  })
  @Column({ 
    name: 'confirmed_at',
    type: 'timestamp', 
    nullable: true 
  })
  confirmedAt: Date;

  // Relación con Pedido
  @ApiProperty({
    description: 'Información del pedido asociado',
    type: () => Pedido
  })
  @OneToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  // Propiedades virtuales
  @ApiProperty({
    description: 'Duración estimada de la entrega en minutos',
    example: 150
  })
  get duracionEstimada(): number | null {
    if (this.startTime && this.endTime) {
      const inicio = new Date(`2000-01-01T${this.startTime}`);
      const fin = new Date(`2000-01-01T${this.endTime}`);
      return Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60));
    }
    return null;
  }

  @ApiProperty({
    description: 'Estado si la entrega está completada',
    example: false
  })
  get estaCompletada(): boolean {
    return this.estadoEntrega === 'ENTREGADA';
  }

  @ApiProperty({
    description: 'Días hasta la fecha de entrega',
    example: 3
  })
  get diasHastaEntrega(): number {
    if (this.deliveryDate) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEntrega = new Date(this.deliveryDate);
      fechaEntrega.setHours(0, 0, 0, 0);
      const diferencia = fechaEntrega.getTime() - hoy.getTime();
      return Math.ceil(diferencia / (1000 * 3600 * 24));
    }
    return 0;
  }
}