import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEntregaDto {
  @ApiProperty({
    description: 'ID del pedido para el cual se programa la entrega',
    example: 1
  })
  pedidoId: number;

  @ApiProperty({
    description: 'Fecha programada para la entrega (YYYY-MM-DD)',
    example: '2025-07-20'
  })
  deliveryDate: string;

  @ApiProperty({
    description: 'Hora de inicio programada (HH:MM:SS)',
    example: '17:00:00'
  })
  startTime: string;

  @ApiPropertyOptional({
    description: 'Hora de finalización estimada (HH:MM:SS)',
    example: '19:30:00'
  })
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Estado inicial de la entrega',
    example: 'PROGRAMADA',
    enum: ['PROGRAMADA', 'EN_RUTA', 'ENTREGADA', 'CANCELADA'],
    default: 'PROGRAMADA'
  })
  estadoEntrega?: string;

  @ApiPropertyOptional({
    description: 'Vehículo asignado para la entrega',
    example: 'Camión Toyota - Placa ABC-123'
  })
  vehiculo?: string;

  @ApiPropertyOptional({
    description: 'Conductor asignado para la entrega',
    example: 'Carlos Mendoza'
  })
  conductor?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales para la entrega',
    example: 'Confirmar acceso al edificio con portería'
  })
  notasEntrega?: string;
}