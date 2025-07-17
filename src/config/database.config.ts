import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

export const dataBaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
    __dirname + '/../**/entity/*.entity{.ts,.js}',
    __dirname + '/../**/entities/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
};

const dataSource = new DataSource(dataBaseConfig);

export default dataSource;
