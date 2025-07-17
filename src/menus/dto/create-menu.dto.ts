import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Nombre del menú',
    example: 'Menú Ejecutivo'
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del menú',
    example: 'Menú completo para el almuerzo ejecutivo'
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Precio unitario del menú en dólares',
    example: 25.50,
    minimum: 0.01
  })
  precioUnitario: number;

  @ApiPropertyOptional({
    description: 'ID de la categoría del menú',
    example: 1
  })
  categoriaId?: number;

  @ApiPropertyOptional({
    description: 'Estado del menú (disponible/no disponible)',
    example: true,
    default: true
  })
  estado?: boolean;

  @ApiPropertyOptional({
    description: 'URL de la imagen del menú',
    example: 'https://example.com/menu.jpg'
  })
  imagenUrl?: string;
}