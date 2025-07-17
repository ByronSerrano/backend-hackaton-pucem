import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { PedidosModule } from '../pedidos/pedidos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    PedidosModule, // Importamos para validar pedidos
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService], // Exportamos para uso en otros módulos
})
export class PagosModule {}