import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './products.entity';

@Entity()
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.inventory)
  product: Product;

  @Column()
  size: string; // S, M, L, XL, 2XL

  @Column()
  quantity: number;
} 