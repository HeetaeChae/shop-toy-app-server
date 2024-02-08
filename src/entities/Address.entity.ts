import { IsPrimary } from 'src/enums/is-primary.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { User } from './User.entity';

@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  @Column({ type: 'text' })
  zipCode: string;

  @Column({ type: 'text' })
  streetAddress: string;

  @Column()
  addressName: string;

  @Column()
  receptorName: string;

  @Column()
  receptorMobile: string;

  @Column({ nullable: true })
  receptorPhone: string;

  @Column({ type: 'enum', enum: IsPrimary, default: IsPrimary.NOTPRIMARY })
  isPrimary: IsPrimary;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
