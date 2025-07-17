import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaMenuDto {
  @ApiProperty({
    description: 'Nombre de la categoría del menú',
    example: 'Desayunos'
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría del menú',
    example: 'Menús para eventos matutinos'
  })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Estado de la categoría (activo/inactivo)',
    example: true,
    default: true
  })
  estado?: boolean;
}