import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;

  @ManyToOne(() => Book, {
    eager: true,
  })
  @JoinColumn({
    name: 'bookId',
  })
  book: Book;

  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price: number;
}
