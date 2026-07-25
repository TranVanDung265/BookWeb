import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 100,
  })
  name: string;

  @Column({
    default: '',
    length: 255,
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
