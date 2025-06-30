import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../customers/customers.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column({ type: 'enum', enum: ['fulfilled', 'unfulfilled', 'pending'], default: 'pending' })
  status: string;

  @Column({ type: 'enum', enum: ['jazzcash', 'easypaisa', 'cod'] })
  paymentMethod: string;

  @Column({ type: 'enum', enum: ['paid', 'unpaid', 'pending'], default: 'unpaid' })
  paymentStatus: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPayment: number;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 