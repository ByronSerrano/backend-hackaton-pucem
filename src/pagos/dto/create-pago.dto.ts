import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePagoDto {
  @ApiProperty({
    description: 'ID del pedido para el cual se registra el pago',
    example: 1
  })
  pedidoId: number;

  @ApiProperty({
    description: 'Monto del pago en dólares',
    example: 75.25,
    minimum: 0.01
  })
  monto: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    example: 'TARJETA',
    enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE']
  })
  metodoPago: string;

  @ApiPropertyOptional({
    description: 'Estado inicial del pago',
    example: 'PENDIENTE',
    enum: ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'],
    default: 'PENDIENTE'
  })
  estadoPago?: string;

  @ApiPropertyOptional({
    description: 'Referencia de la transacción (número de autorización, código, etc.)',
    example: 'TXN-ABC123456'
  })
  referenciaTransaccion?: string;
}