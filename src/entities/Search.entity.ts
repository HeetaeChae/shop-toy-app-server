import { PickType } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { User } from './User.entity';

@Entity({ name: 'searches' })
export class Search extends BaseEntity {
  @Column({ type: 'text' })
  keyword: string;

  @CreateDateColumn({ name: 'searched_at' })
  searchedAt: Date;

  @ManyToOne(() => User, (user) => user.searches, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
