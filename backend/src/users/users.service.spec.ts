import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [
      {
        id: 1,
        fullName: 'Dung Chung',
        email: 'dung@gmail.com',
      },
    ];

    mockUserRepository.find.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('should return one user', async () => {
    const user = {
      id: 1,
      email: 'dung@gmail.com',
    };

    mockUserRepository.findOne.mockResolvedValue(user);

    expect(await service.findOne(1)).toEqual(user);
  });

  it('should return user by email', async () => {
    const user = {
      id: 1,
      email: 'dung@gmail.com',
    };

    mockUserRepository.findOne.mockResolvedValue(user);

    expect(await service.findByEmail('dung@gmail.com')).toEqual(user);
  });

  it('should remove user', async () => {
    mockUserRepository.delete.mockResolvedValue({});

    expect(await service.remove(1)).toEqual({
      message: 'Xóa thành công',
    });
  });
});
