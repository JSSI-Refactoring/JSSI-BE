import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';

@Entity()
export class CommentEntity extends CommonPkEntity {
  @Column('varchar', { unique: false, nullable: true })
  comment: string;

  // Comment - Post
  // Comment - User
}
