import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart, Book, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
