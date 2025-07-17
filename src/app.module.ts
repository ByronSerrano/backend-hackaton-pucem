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
import { PlatosModule } from './platos/platos.module';

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
    MenusModule,
    PedidosModule,
    EntregaModule,
    PagosModule,
    PlatosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}