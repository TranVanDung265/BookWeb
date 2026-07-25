import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartRepository = {
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockBookRepository = {
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all orders', async () => {
    const orders = [{ id: 1 }];

    mockOrderRepository.find.mockResolvedValue(orders);

    expect(await service.findAll()).toEqual(orders);
  });

  it('should return one order', async () => {
    const order = { id: 1 };

    mockOrderRepository.findOne.mockResolvedValue(order);

    expect(await service.findOne(1)).toEqual(order);
  });

  it('should create order successfully', async () => {
    const dto = {
      userId: 1,
      phone: '0123456789',
      address: 'Hà Nội',
    };

    const user = {
      id: 1,
    };

    const cartItems = [
      {
        quantity: 2,
        book: {
          id: 1,
          price: 100,
          stock: 10,
        },
      },
    ];

    const order = {
      id: 1,
      totalPrice: 200,
    };

    mockUserRepository.findOne.mockResolvedValue(user);
    mockCartRepository.find.mockResolvedValue(cartItems);

    mockOrderRepository.create.mockReturnValue(order);
    mockOrderRepository.save.mockResolvedValue(order);

    mockOrderItemRepository.create.mockReturnValue({});
    mockOrderItemRepository.save.mockResolvedValue({});

    mockBookRepository.save.mockResolvedValue({});

    mockCartRepository.remove.mockResolvedValue({});

    expect(await service.create(dto as any)).toEqual(order);
  });

  it('should throw if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        userId: 99,
      } as any),
    ).rejects.toThrow('User not found');
  });

  it('should throw if cart is empty', async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: 1,
    });

    mockCartRepository.find.mockResolvedValue([]);

    await expect(
      service.create({
        userId: 1,
      } as any),
    ).rejects.toThrow('Cart is empty');
  });
});
