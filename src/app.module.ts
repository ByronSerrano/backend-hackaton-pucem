import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataBaseConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientesModule } from './clientes/clientes.module';
import { MenusModule } from './menus/menus.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { EntregaModule } from './entregas/entrega.module'; // Corregido: EntregasModule
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        ...dataBaseConfig,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ClientesModule,
    MenusModule,     // ← Agregado
    PedidosModule,   // ← Agregado  
    EntregaModule,  // ← Agregado (corregido nombre)
    PagosModule,     // ← Agregado
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}