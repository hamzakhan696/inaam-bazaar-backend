import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ default: false })
  isEmailSubscribed: boolean;

  @Column({ default: false })
  isSmsSubscribed: boolean;
} 