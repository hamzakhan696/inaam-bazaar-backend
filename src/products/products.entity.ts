import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../categories/categories.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  color: string;

  @Column('simple-array', { nullable: true })
  sizes: string[];

  @Column()
  price: number;

  @Column({ nullable: true })
  comparePrice: number;

  @Column({ nullable: true })
  discount: number;

  @Column()
  inventory: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category)
  category: Category;

  @Column({ default: 1 })
  status: number;
}
