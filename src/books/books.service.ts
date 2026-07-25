import { Like } from 'typeorm';
import { QueryBookDto } from './dto/query-book.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const category = await this.categoriesService.findOne(
      createBookDto.categoryId,
    );

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    const book = this.bookRepository.create({
      title: createBookDto.title,
      author: createBookDto.author,
      publisher: createBookDto.publisher,
      price: createBookDto.price,
      stock: createBookDto.stock,
      description: createBookDto.description,
      image: createBookDto.image,
      category,
    });

    return await this.bookRepository.save(book);
  }

  async findAll(query: QueryBookDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const keyword = query.keyword || '';
    const categoryId = Number(query.categoryId);

    const where: any = {
      title: Like(`%${keyword}%`),
    };

    // Lọc theo danh mục nếu có categoryId
    if (categoryId) {
      where.category = {
        id: categoryId,
      };
    }

    const [books, total] = await this.bookRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return await this.bookRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (!book) {
      throw new NotFoundException('Không tìm thấy sách');
    }

    if (updateBookDto.categoryId) {
      const category = await this.categoriesService.findOne(
        updateBookDto.categoryId,
      );

      if (!category) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      book.category = category;
    }

    Object.assign(book, updateBookDto);

    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    await this.bookRepository.delete(id);

    return {
      message: 'Xóa sách thành công',
    };
  }
}
