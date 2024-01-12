import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Inquiry } from './Inquiry.entity';
import { User } from './User.entity';

@Entity({ name: 'inquiry_comments' })
export class InquiryComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.inquiryComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inquiry_id' })
  inquiry: Inquiry;

  @ManyToOne(() => User, (user) => user.inquiryComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
