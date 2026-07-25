import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createOrderDto.userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const cartItems = await this.cartRepository.find({
      where: {
        user: {
          id: createOrderDto.userId,
        },
      },
      relations: {
        book: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalPrice = 0;

    for (const item of cartItems) {
      totalPrice += Number(item.book.price) * item.quantity;
    }

    const order = this.orderRepository.create({
      user,
      phone: createOrderDto.phone,
      address: createOrderDto.address,
      totalPrice,
    });

    await this.orderRepository.save(order);
    for (const item of cartItems) {
      const orderItem = this.orderItemRepository.create({
        order,
        book: item.book,
        quantity: item.quantity,
        price: item.book.price,
      });

      await this.orderItemRepository.save(orderItem);
      item.book.stock -= item.quantity;
      await this.bookRepository.save(item.book);
    }
    await this.cartRepository.remove(cartItems);

    return order;
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        user: true,
        orderItems: {
          book: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orderItems: {
          book: true,
        },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates order #${id}`;
  }

  remove(id: number) {
    return `This action removes order #${id}`;
  }
}
