import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { LotteriesModule } from './lotteries/lotteries.module';
import { CustomColorsModule } from './custom-colors/custom-colors.module';
import { entities } from './global-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InventoryModule } from './inventory/inventory.module';
import { WebhookModule } from './webhook/webhook.module';
import { DiscountsModule } from './discounts/discounts.module';
import { DealsModule } from './deals/deals.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: true,
        logging: true,
        entities,
      }),
    }),
    ProductsModule,
    CategoriesModule,
    LotteriesModule,
    CustomColorsModule,
    AuthModule,
    UserModule,
    InventoryModule,
    WebhookModule,
    DiscountsModule,
    DealsModule,
    CustomersModule,
  ],
})
export class AppModule {}
