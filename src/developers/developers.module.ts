import { Module } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { DevelopersResolver } from './developers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { Project } from 'src/projects/entities/projects.entity';
import { Skill } from 'src/skills/entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Developer, Project, Skill]),
  ],
  providers: [DevelopersResolver, DevelopersService],
  exports: [DevelopersService]
})
export class DevelopersModule { }
