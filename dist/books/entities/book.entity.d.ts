import { Category } from '../../categories/entities/category.entity';
export declare class Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    category: Category;
    createdAt: Date;
}
