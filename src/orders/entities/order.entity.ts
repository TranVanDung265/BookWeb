import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { OneToMany } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
  })
  orderItems: OrderItem[];

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;
}
