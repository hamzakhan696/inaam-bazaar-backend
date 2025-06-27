import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  discountCode?: string;

  @Column()
  discountValue: number;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  productId?: number;

  @Column()
  maximumDiscountUses: number;

  @Column('simple-array')
  combination: string[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
} 