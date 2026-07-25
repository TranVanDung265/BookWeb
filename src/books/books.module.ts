import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), CategoriesModule, AuthModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
