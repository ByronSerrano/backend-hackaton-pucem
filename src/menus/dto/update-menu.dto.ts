import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  // Todos los campos de CreateMenuDto ahora son opcionales
  // para las operaciones de actualización
}