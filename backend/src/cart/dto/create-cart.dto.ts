import { IsInt, IsPositive } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  bookId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
