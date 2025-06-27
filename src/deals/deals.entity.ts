import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  productId?: number;

  @Column({ nullable: true })
  lotteryId?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  comparePrice?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount?: number;

  @Column()
  quantity: number;
} 