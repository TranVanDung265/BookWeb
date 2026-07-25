import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const categories = [
      { id: 1, name: 'Tiểu thuyết' },
      { id: 2, name: 'Khoa học' },
    ];

    mockCategoryRepository.find.mockResolvedValue(categories);

    expect(await service.findAll()).toEqual(categories);
  });

  it('should return one category', async () => {
    const category = {
      id: 1,
      name: 'Tiểu thuyết',
    };

    mockCategoryRepository.findOne.mockResolvedValue(category);

    expect(await service.findOne(1)).toEqual(category);
  });

  it('should create category', async () => {
    const dto = {
      name: 'Thiếu nhi',
    };

    mockCategoryRepository.create.mockReturnValue(dto);
    mockCategoryRepository.save.mockResolvedValue(dto);

    expect(await service.create(dto as any)).toEqual(dto);
  });

  it('should delete category', async () => {
    mockCategoryRepository.delete.mockResolvedValue({});

    expect(await service.remove(1)).toEqual({
      message: 'Xóa danh mục thành công',
    });
  });
});
