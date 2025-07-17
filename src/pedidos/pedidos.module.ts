import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { MenusModule } from '../menus/menus.module'; // ← Agregar esta importación

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    ClientesModule, // Para validar clientes
    MenusModule,    // ← Para validar menús y calcular precios
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService], // Exportamos para uso en otros módulos
})
export class PedidosModule {}