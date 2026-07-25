import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Book])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
