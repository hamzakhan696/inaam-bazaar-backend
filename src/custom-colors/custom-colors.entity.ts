import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CustomColor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
} 