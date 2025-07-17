import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaMenuDto {
  @ApiProperty({
    description: 'Nombre de la categoría del menú',
    example: 'Desayunos',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la categoría del menú',
    example: 'Categoría para todos los desayunos disponibles',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Estado de la categoría (activo/inactivo)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
