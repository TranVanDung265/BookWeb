import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
