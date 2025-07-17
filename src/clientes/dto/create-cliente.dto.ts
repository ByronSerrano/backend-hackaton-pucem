import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan'
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del cliente',
    example: 'Pérez'
  })
  apellido: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del cliente',
    example: '+593999123456'
  })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@email.com'
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa del cliente',
    example: 'Av. Principal 123, Centro'
  })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Ciudad de residencia',
    example: 'Portoviejo'
  })
  ciudad?: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '130105'
  })
  codigoPostal?: string;

  @ApiPropertyOptional({
    description: 'Estado del cliente (activo/inactivo)',
    example: true,
    default: true
  })
  estado?: boolean;
}