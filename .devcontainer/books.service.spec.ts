import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookRepository: any;

  const mockBook = { id: 1, title: 'Lập trình NestJS', price: 150000, stock: 5 };

  beforeEach(async () => {
    mockBookRepository = {
      find: jest.fn().mockResolvedValue([mockBook]),
      findOneBy: jest.fn(),
      save: jest.fn().mockResolvedValue(mockBook),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('1. Đã được khởi tạo thành công (Service defined)', () => {
    expect(service).toBeDefined();
  });

  describe('findOne()', () => {
    it('2. Trả về thông tin sách nếu tồn tại ID', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(mockBook);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
    });

    it('3. Bắt lỗi NotFoundException khi ID sách không tồn tại', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reduceStock()', () => {
    it('4. Bắt lỗi BadRequestException khi số lượng đặt mua vượt quá tồn kho', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(mockBook); // stock = 5
      await expect(service.reduceStock(1, 10)).rejects.toThrow(BadRequestException);
    });
  });
});
