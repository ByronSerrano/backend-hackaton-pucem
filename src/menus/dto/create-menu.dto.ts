import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Length,
  IsUrl,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Nombre del menú',
    example: 'Menú Ejecutivo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del menú',
    example: 'Menú completo para el almuerzo ejecutivo',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Indica si tiene precio unitario',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  precioUnitario?: boolean;

  @ApiProperty({
    description: 'URL de la imagen del menú',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imagenUrl: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría del menú',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoriaMenuId?: number;

  @ApiPropertyOptional({
    description: 'Estado del menú (activo/inactivo)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}