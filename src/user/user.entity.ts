import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column({ unique: true })
  email: string;

  @Column('bigint')
  contactNumber: number;

  @Column()
  nationality: string;

  @Column('bigint')
  dateOfBirth: number;

  @Column({ nullable: true })
  profilePicture: string;
} 