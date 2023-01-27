import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Project } from 'src/projects/entities/projects.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Developer {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @ManyToMany(() => Project, (project) => project.developers)
  @Field(() => [Project], { nullable: true })
  projects?: Project[];

  @ManyToMany(() => Skill, (skill) => skill.developers, {
    cascade: true,
  })
  @JoinTable({
    name: 'developers_skills',
    joinColumn: {
      name: 'developert_id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
    },
  })
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}
