import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column()
  description: string;

  @Column('simple-array', { nullable: true })
  productIds: number[];
}
