import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @ManyToOne(() => Book, {
    eager: true,
  })
  @JoinColumn({
    name: 'bookId',
  })
  book: Book;

  @Column({
    default: 1,
  })
  quantity: number;
}
