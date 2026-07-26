import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createCartDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const book = await this.bookRepository.findOne({
      where: {
        id: createCartDto.bookId,
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const cart = this.cartRepository.create({
      user,
      book,
      quantity: createCartDto.quantity,
    });

    return this.cartRepository.save(cart);
  }

  findAll() {
    return this.cartRepository.find({
      relations: {
        book: true,
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.cartRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const cart = await this.findOne(id);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.cartRepository.remove(cart);
  }
}
