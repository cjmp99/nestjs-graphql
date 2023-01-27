import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/projects.entity';
import { DevelopersModule } from 'src/developers/developers.module';
import { Developer } from 'src/developers/entities/developer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Developer]),
  ], 
  providers: [ProjectsService, ProjectsResolver],
})
export class ProjectsModule {}
