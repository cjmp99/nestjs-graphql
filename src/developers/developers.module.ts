import { forwardRef, Module } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { DevelopersResolver } from './developers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { Project } from 'src/projects/entities/projects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Developer, Project]),
  ],
  providers: [DevelopersResolver, DevelopersService],
  exports: [DevelopersService]
})
export class DevelopersModule { }
