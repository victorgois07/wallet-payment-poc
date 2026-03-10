import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StepNameEnum } from '../enums';
import type { PaymentEntity } from './payment.entity';

@Entity('payment_steps')
export class PaymentStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', enum: StepNameEnum })
  step!: StepNameEnum;

  @Column({ type: 'integer' })
  timeMs!: number;

  @Column({ type: 'integer' })
  order!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  completedAt!: Date;

  @ManyToOne('PaymentEntity', 'steps')
  payment!: PaymentEntity;
}
