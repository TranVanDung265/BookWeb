import { QueryBookDto } from './dto/query-book.dto';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CategoriesService } from '../categories/categories.service';
export declare class BooksService {
    private readonly bookRepository;
    private readonly categoriesService;
    constructor(bookRepository: Repository<Book>, categoriesService: CategoriesService);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(query: QueryBookDto): Promise<{
        data: Book[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Book | null>;
    update(id: number, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
