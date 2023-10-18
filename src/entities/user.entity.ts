import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { GoalEntity } from './goal.entity';

@Entity('User')
export class UserEntity extends CommonPkEntity {
  @Column('varchar', { unique: true, nullable: false })
  socialId: string;

  @Column('varchar', { unique: false, nullable: false })
  socialType: string;

  @Column('varchar', { unique: false, nullable: false })
  nickname: string;

  @Column('varchar', { unique: false, nullable: false })
  profileImage: string;

  // User - Goal 일대다
  @OneToMany(() => GoalEntity, (goal) => goal.user)
  goals: GoalEntity[];

  // 
  // User - Like 다대다
}
