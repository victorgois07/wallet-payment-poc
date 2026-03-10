import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum, StrategyTypeEnum } from '../enums';
import { PaymentStepEntity } from './payment-step.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryColumn({ type: 'varchar' })
  transactionId!: string;

  @Column({ type: 'varchar', enum: PaymentStatusEnum, default: PaymentStatusEnum.PROCESSING })
  status!: PaymentStatusEnum;

  @Column({ type: 'real' })
  amount!: number;

  @Column({ type: 'varchar' })
  cardLastFour!: string;

  @Column({ type: 'varchar' })
  cardholderName!: string;

  @Column({ type: 'varchar', enum: StrategyTypeEnum })
  strategy!: StrategyTypeEnum;

  @Column({ type: 'integer', default: 0 })
  totalTimeMs!: number;

  @OneToMany(
    () => PaymentStepEntity,
    (step) => step.payment,
    { cascade: true, eager: true },
  )
  steps!: PaymentStepEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
