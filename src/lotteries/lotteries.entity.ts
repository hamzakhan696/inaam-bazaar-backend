import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Lottery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('datetime', { nullable: false })
  startDate: Date;

  @Column('datetime', { nullable: false })
  endDate: Date;

  @Column()
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ type: 'enum', enum: ['active', 'lucky-dip', 'treasure'], default: 'active' })
  category: 'active' | 'lucky-dip' | 'treasure';

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}

@Entity()
export class Winner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lotteryId: number;

  @ManyToOne(() => Lottery)
  @JoinColumn({ name: 'lotteryId' })
  lottery: Lottery;

  @Column()
  winnerName: string;

  @Column()
  prize: string;

  @Column('datetime')
  drawDate: Date;

  // Optional: image, city, etc.
}
