import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'ID del cliente que realiza el pedido',
    example: 1
  })
  clienteId: number;

  @ApiProperty({
    description: 'ID del menú solicitado',
    example: 1
  })
  menuId: number;

  @ApiProperty({
    description: 'Fecha del evento (YYYY-MM-DD)',
    example: '2025-07-20'
  })
  eventDate: string;

  @ApiProperty({
    description: 'Hora del evento (HH:MM:SS)',
    example: '18:30:00'
  })
  eventTime: string;

  @ApiProperty({
    description: 'Cantidad de menús solicitados',
    example: 3,
    minimum: 1,
    default: 1
  })
  cantidadMenus: number;

  @ApiProperty({
    description: 'Número de personas para el evento',
    example: 25,
    minimum: 1
  })
  numeroPersonas: number;

  @ApiProperty({
    description: 'Dirección donde se realizará el evento',
    example: 'Av. Manabí 456, Salón Los Jardines'
  })
  direccionEvento: string;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales del pedido',
    example: 'Sin cebolla en las ensaladas, evento al aire libre'
  })
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto para el evento',
    example: '+593999654321'
  })
  telefonoContacto?: string;

  @ApiPropertyOptional({
    description: 'Estado inicial del pedido',
    example: 'PENDIENTE',
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'],
    default: 'PENDIENTE'
  })
  estado?: string;
}