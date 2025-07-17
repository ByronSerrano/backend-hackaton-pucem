import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregasService } from './entrega.service';
import { EntregasController } from './entrega.controller';
import { Entrega } from './entities/entrega.entity';
import { PedidosModule } from '../pedidos/pedidos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entrega]),
    PedidosModule, // Importamos para validar pedidos
  ],
  controllers: [EntregasController],
  providers: [EntregasService],
  exports: [EntregasService], // Exportamos para uso en otros módulos
})
export class EntregaModule {}