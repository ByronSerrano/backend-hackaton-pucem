import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Length,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlatoDto {
  @ApiProperty({
    description: 'Nombre del plato',
    example: 'Ensalada César',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del plato',
    example: 'Ensalada fresca con lechuga, pollo, crutones y aderezo césar',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'ID del menú al que pertenece el plato (opcional)',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  menuId?: number;

  @ApiPropertyOptional({
    description: 'IDs de los insumos que componen el plato',
    example: [1, 2, 3],
    type: [Number],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  insumoIds?: number[];
}