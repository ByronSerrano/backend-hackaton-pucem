import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Length,
  IsDecimal,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInsumoDto {
  @ApiProperty({
    description: 'Nombre del insumo',
    example: 'Tomate',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del insumo',
    example: 'Tomate fresco para ensaladas y guarniciones',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Cantidad en stock del insumo',
    example: 50.5,
    type: 'number',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Precio unitario del insumo',
    example: 2.50,
    type: 'number',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_unitario: number;
}