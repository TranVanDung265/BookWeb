import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService - TaoDonHang', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        // Mock các Repository liên quan ở đây
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('1. Bắt lỗi không cho đặt hàng nếu giỏ hàng trống', async () => {
    const emptyCart = [];
    await expect(service.createOrder(1, emptyCart)).rejects.toThrow(
      new BadRequestException('Giỏ hàng đang trống, không thể tạo đơn hàng!'),
    );
  });
});
