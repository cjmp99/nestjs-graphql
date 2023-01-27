import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Project } from 'src/projects/entities/projects.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
