"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
const categories_service_1 = require("../categories/categories.service");
let BooksService = class BooksService {
    bookRepository;
    categoriesService;
    constructor(bookRepository, categoriesService) {
        this.bookRepository = bookRepository;
        this.categoriesService = categoriesService;
    }
    async create(createBookDto) {
        const category = await this.categoriesService.findOne(createBookDto.categoryId);
        if (!category) {
            throw new common_1.NotFoundException('Danh mục không tồn tại');
        }
        const book = this.bookRepository.create({
            title: createBookDto.title,
            author: createBookDto.author,
            publisher: createBookDto.publisher,
            price: createBookDto.price,
            stock: createBookDto.stock,
            description: createBookDto.description,
            image: createBookDto.image,
            category,
        });
        return await this.bookRepository.save(book);
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;
        const keyword = query.keyword || '';
        const categoryId = Number(query.categoryId);
        const where = {
            title: (0, typeorm_1.Like)(`%${keyword}%`),
        };
        if (categoryId) {
            where.category = {
                id: categoryId,
            };
        }
        const [books, total] = await this.bookRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: books,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return await this.bookRepository.findOne({
            where: { id },
        });
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        if (!book) {
            throw new common_1.NotFoundException('Không tìm thấy sách');
        }
        if (updateBookDto.categoryId) {
            const category = await this.categoriesService.findOne(updateBookDto.categoryId);
            if (!category) {
                throw new common_1.NotFoundException('Danh mục không tồn tại');
            }
            book.category = category;
        }
        Object.assign(book, updateBookDto);
        return await this.bookRepository.save(book);
    }
    async remove(id) {
        await this.bookRepository.delete(id);
        return {
            message: 'Xóa sách thành công',
        };
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        categories_service_1.CategoriesService])
], BooksService);
//# sourceMappingURL=books.service.js.map