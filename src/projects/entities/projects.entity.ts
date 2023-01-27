import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Developer } from 'src/developers/entities/developer.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field({ defaultValue: true })
  status?: boolean;

  @ManyToMany(() => Developer, (developer) => developer.projects, {
    cascade: true,
  })
  @JoinTable({
    name: 'projects_developers',
    joinColumn: {
      name: 'project_id',
    },
    inverseJoinColumn: {
      name: 'developer_id',
    },
  })
  @Field(() => [Developer], { nullable: true })
  developers?: Developer[];

  @ManyToMany(() => Skill, (skill) => skill.projects, {
    cascade: true,
  })
  @JoinTable({
    name: 'projects_skills',
    joinColumn: {
      name: 'project_id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
    },
  })
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}