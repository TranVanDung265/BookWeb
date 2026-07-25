import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { CategoriesService } from '../categories/categories.service';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
  let service: BooksService;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one book', async () => {
    const book = {
      id: 1,
      title: 'NestJS',
    };

    mockBookRepository.findOne.mockResolvedValue(book);

    expect(await service.findOne(1)).toEqual(book);
  });

  it('should return paginated books', async () => {
    mockBookRepository.findAndCount.mockResolvedValue([
      [{ id: 1, title: 'Book' }],
      1,
    ]);

    const result = await service.findAll({} as any);

    expect(result.total).toBe(1);
    expect(result.data.length).toBe(1);
  });

  it('should remove book', async () => {
    mockBookRepository.delete.mockResolvedValue({});

    expect(await service.remove(1)).toEqual({
      message: 'Xóa sách thành công',
    });
  });
});
