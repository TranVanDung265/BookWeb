import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column()
  stock: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    default: '',
  })
  image: string;

  @ManyToOne(() => Category, {
    eager: true,
  })
  @JoinColumn({
    name: 'categoryId',
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
