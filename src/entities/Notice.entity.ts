import { IsActive } from 'src/enums/is-active.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { User } from './User.entity';

@Entity({ name: 'notices' })
export class Notice extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: IsActive,
    default: IsActive.ACTIVE,
    name: 'is_active',
  })
  isActive: IsActive;

  @ManyToOne(() => User, (user) => user.notices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
