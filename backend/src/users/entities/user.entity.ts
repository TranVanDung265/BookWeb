import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  fullName: string;

  @Column({
    unique: true,
    length: 100,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: '',
    length: 15,
  })
  phone: string;

  @Column({
    default: '',
    length: 255,
  })
  address: string;

  @Column({
    default: 'USER',
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
