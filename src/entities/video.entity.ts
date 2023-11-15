import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonPk } from '@entities/common/common.entity';
import { Goal } from '@entities/goal.entity';

@Entity({ name: 'video', schema: 'jssi' })
export class Video extends CommonPk {
  @Column('varchar', { unique: false, nullable: true })
  video1: string;

  @Column('varchar', { unique: false, nullable: true })
  video2: string;

  @Column('varchar', { unique: false, nullable: true })
  video3: string;

  @Column('varchar', { unique: false, nullable: true })
  finalVideo: string;

  @Column('int', { unique: true, nullable: false })
  goalId: number;

  // goal: 일대일
  @OneToOne(() => Video)
  @JoinColumn({ name: 'goalId' })
  goal: Goal;
}
