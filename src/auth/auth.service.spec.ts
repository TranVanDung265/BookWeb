import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('should register successfully', async () => {
      const dto = {
        fullName: 'Dung',
        email: 'dung@gmail.com',
        password: '123456',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(dto);

      expect(await service.register(dto)).toEqual(dto);
    });

    it('should throw BadRequestException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
      });

      await expect(
        service.register({
          email: 'dung@gmail.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login()', () => {
    it('should login successfully', async () => {
      const user = {
        id: 1,
        fullName: 'Dung',
        email: 'dung@gmail.com',
        password: 'hashed-password',
        role: 'USER',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);

      mockedBcrypt.compare.mockResolvedValue(true);

      mockJwtService.sign.mockReturnValue('fake-jwt-token');

      const result = await service.login({
        email: 'dung@gmail.com',
        password: '123456',
      });

      expect(result.access_token).toBe('fake-jwt-token');
      expect(result.message).toBe('Đăng nhập thành công');
    });

    it('should throw UnauthorizedException if email not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'abc@gmail.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        password: 'hashed-password',
      });

      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'dung@gmail.com',
          password: '111111',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
