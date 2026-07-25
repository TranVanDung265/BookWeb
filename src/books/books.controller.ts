import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // =========================
  // CHỈ ADMIN ĐƯỢC THÊM SÁCH
  // =========================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  // =========================
  // CHỈ ADMIN UPLOAD ẢNH
  // =========================
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          callback(null, fileName + extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      image: `uploads/${file.filename}`,
    };
  }

  // =========================
  // AI CŨNG XEM ĐƯỢC
  // =========================
  @Get()
  findAll(@Query() query: QueryBookDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  // =========================
  // CHỈ ADMIN SỬA
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  // =========================
  // CHỈ ADMIN XÓA
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
