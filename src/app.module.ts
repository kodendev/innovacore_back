import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { HospitalBedsModule } from './hospital-beds/hospital-beds.module';
import { PartnersModule } from './partners/partners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    InventoryModule,
    PosModule,
    HospitalBedsModule,
    PartnersModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // o 'mysql', 'sqlite', etc.
      host: '172.28.226.196',
      port: 5432,
      username: 'gfreddi',
      password: 'GFdev2024%%',
      database: 'innova_core',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica a todas las rutas
  }
}
