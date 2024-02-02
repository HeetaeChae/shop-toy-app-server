import { IsSecret } from 'src/enums/is-secret.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { InquiryComment } from './InquiryComment.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity({ name: 'inquiries' })
export class Inquiry extends BaseEntity {
  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    name: 'is_secret',
    type: 'enum',
    enum: IsSecret,
    default: IsSecret.NOTSECRET,
  })
  isSecret: IsSecret;

  @ManyToOne(() => User, (user) => user.inquiries, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.inquiries, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: User;

  @OneToMany(() => InquiryComment, (inquiryComments) => inquiryComments.inquiry)
  inquiryComments: InquiryComment[];
}
