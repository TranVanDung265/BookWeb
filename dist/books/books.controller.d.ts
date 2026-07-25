import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto): Promise<import("./entities/book.entity").Book>;
    uploadFile(file: Express.Multer.File): {
        image: string;
    };
    findAll(query: QueryBookDto): Promise<{
        data: import("./entities/book.entity").Book[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/book.entity").Book | null>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<import("./entities/book.entity").Book>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
