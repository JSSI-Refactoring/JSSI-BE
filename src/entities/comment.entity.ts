import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('Comment')
export class CommentEntity extends CommonPkEntity {
  @Column('int', { unique: false, nullable: false })
  userId: number;

  @Column('int', { unique: false, nullable: false })
  postId: number;

  @Column('varchar', { unique: false, nullable: true })
  comment: string;

  // user: 다대일
  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  // post: 다대일
  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: PostEntity;
}
