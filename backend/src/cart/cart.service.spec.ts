import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';

describe('CartService', () => {
  let service: CartService;

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockBookRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all carts', async () => {
    const carts = [
      {
        id: 1,
        quantity: 2,
      },
    ];

    mockCartRepository.find.mockResolvedValue(carts);

    expect(await service.findAll()).toEqual(carts);
  });

  it('should create cart successfully', async () => {
    const dto = {
      userId: 1,
      bookId: 1,
      quantity: 2,
    };

    const user = { id: 1 };
    const book = { id: 1 };

    mockUserRepository.findOne.mockResolvedValue(user);
    mockBookRepository.findOne.mockResolvedValue(book);

    const cart = {
      user,
      book,
      quantity: 2,
    };

    mockCartRepository.create.mockReturnValue(cart);
    mockCartRepository.save.mockResolvedValue(cart);

    expect(await service.create(dto as any)).toEqual(cart);
  });

  it('should throw if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        userId: 1,
        bookId: 1,
        quantity: 1,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove cart', async () => {
    const cart = { id: 1 };

    jest.spyOn(service, 'findOne').mockResolvedValue(cart as any);

    mockCartRepository.remove.mockResolvedValue(cart);

    expect(await service.remove(1)).toEqual(cart);
  });

  it('should throw if cart not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
