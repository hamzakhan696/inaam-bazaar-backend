import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
