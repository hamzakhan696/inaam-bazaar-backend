import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  discountCode?: string;

  @Column()
  discountValue: number;

  @Column('json', { nullable: true })
  categoryIds: number[];

  @Column('json', { nullable: true })
  productIds: number[];

  @Column()
  maximumDiscountUses: number;

  @Column('simple-array')
  combination: string[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
} 