import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Developer } from 'src/developers/entities/developer.entity';
import { Project } from 'src/projects/entities/projects.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Skill {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToMany(() => Project, (project) => project.skills)
  @Field(() => [Project], { nullable: true })
  projects?: Project[];

  @ManyToMany(() => Developer, (developer) => developer.skills)
  @Field(() => [Developer], { nullable: true })
  developers?: Developer[];
}
