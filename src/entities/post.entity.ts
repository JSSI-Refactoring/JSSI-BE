import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { GoalEntity } from './goal.entity';

@Entity()
export class PostEntity extends CommonPkEntity {
  @Column('int', { unique: true, nullable: false })
  goalId: number;
}
