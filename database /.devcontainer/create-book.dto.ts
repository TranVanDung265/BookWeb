import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Tên sách không được để trống' })
  @IsString({ message: 'Tên sách phải là chuỗi ký tự' })
  title: string;

  @IsNotEmpty({ message: 'Tác giả không được để trống' })
  author: string;

  @IsNumber({}, { message: 'Giá bán phải là một số' })
  @IsPositive({ message: 'Giá bán phải lớn hơn 0' })
  price: number;

  @IsNumber({}, { message: 'Số lượng tồn phải là số nguyên' })
  @Min(0, { message: 'Số lượng tồn không được nhỏ hơn 0' })
  stock: number;
}
