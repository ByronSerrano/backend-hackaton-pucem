import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity('PAGOS')
export class Pago {
  @ApiProperty({
    description: 'ID único del pago',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'pago_id' })
  pagoId: number;

  @ApiProperty({
    description: 'ID del pedido asociado',
    example: 1
  })
  @Column({ name: 'pedido_id', type: 'int', nullable: false })
  pedidoId: number;

  @ApiProperty({
    description: 'Monto del pago en dólares',
    example: 75.25
  })
  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: false 
  })
  monto: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    example: 'TARJETA',
    enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE']
  })
  @Column({ 
    name: 'metodo_pago',
    type: 'varchar', 
    nullable: false,
    length: 20
  })
  metodoPago: string;

  @ApiProperty({
    description: 'Estado del pago',
    example: 'COMPLETADO',
    enum: ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO']
  })
  @Column({ 
    name: 'estado_pago',
    type: 'varchar', 
    default: 'PENDIENTE',
    length: 20
  })
  estadoPago: string;

  @ApiProperty({
    description: 'Fecha y hora del pago',
    example: '2025-07-17T15:30:00Z'
  })
  @CreateDateColumn({ 
    name: 'paid_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  paidAt: Date;

  @ApiProperty({
    description: 'Referencia de la transacción',
    example: 'TXN-ABC123456',
    required: false
  })
  @Column({ 
    name: 'referencia_transaccion',
    type: 'varchar', 
    nullable: true,
    length: 100
  })
  referenciaTransaccion: string;

  // Relación con Pedido
  @ApiProperty({
    description: 'Información del pedido asociado',
    type: () => Pedido
  })
  @ManyToOne(() => Pedido, { eager: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  // Propiedades virtuales
  @ApiProperty({
    description: 'Indica si el pago está completado',
    example: true
  })
  get estaCompletado(): boolean {
    return this.estadoPago === 'COMPLETADO';
  }

  @ApiProperty({
    description: 'Indica si el pago está pendiente',
    example: false
  })
  get estaPendiente(): boolean {
    return this.estadoPago === 'PENDIENTE';
  }

  @ApiProperty({
    description: 'Descripción del método de pago',
    example: 'Pago con tarjeta de crédito'
  })
  get descripcionMetodo(): string {
    const descripciones = {
      'EFECTIVO': 'Pago en efectivo',
      'TARJETA': 'Pago con tarjeta de crédito/débito',
      'TRANSFERENCIA': 'Transferencia bancaria',
      'CHEQUE': 'Pago con cheque'
    };
    return descripciones[this.metodoPago] || 'Método de pago desconocido';
  }

  @ApiProperty({
    description: 'Días desde que se realizó el pago',
    example: 5
  })
  get diasDesdeElPago(): number {
    if (this.paidAt) {
      const hoy = new Date();
      const fechaPago = new Date(this.paidAt);
      const diferencia = hoy.getTime() - fechaPago.getTime();
      return Math.floor(diferencia / (1000 * 3600 * 24));
    }
    return 0;
  }
}