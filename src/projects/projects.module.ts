import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/projects.entity';
import { DevelopersModule } from 'src/developers/developers.module';
import { Developer } from 'src/developers/entities/developer.entity';
import { Skill } from 'src/skills/entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Developer, Skill]),
  ], 
  providers: [ProjectsService, ProjectsResolver],
  exports: [ProjectsService]
})
export class ProjectsModule {}
