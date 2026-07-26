import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryBookDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  categoryId?: string;
}
