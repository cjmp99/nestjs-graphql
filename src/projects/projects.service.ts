import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Developer } from 'src/developers/entities/developer.entity';
import { Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Developer) private developerRepository: Repository<Developer>,
  ) { }

  findAll(id?: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        id
      },
      relations: ['developers']
    });
  }

  findById(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ['developers']
    });
  }

  findAllDevelopers(ids?: Developer[]): Promise<Developer[]> {
    return this.developerRepository.findByIds(
      ids,
    );
  }

  async createProject(project: CreateProjectInput): Promise<Project> {
    const newProject = new Project();
    newProject.name = project.name;
    newProject.description = project.description;
    newProject.status = project.status;

    if (project?.developers) {
      const developersIds = project?.developers;
      const developers = await this.developerRepository.findByIds(developersIds);
      newProject.developers = developers;
      return this.projectRepository.save(newProject);
    } else {
      return this.projectRepository.save(newProject);
    }
  }

  async update(id: number, updateProjectInput: UpdateProjectInput): Promise<Project> {
    const updateProject = new Project();
    updateProject.id = id;
    updateProject.name = updateProjectInput.name;
    updateProject.description = updateProjectInput.description;
    updateProject.status = updateProjectInput?.status;

    if (updateProjectInput?.developers) {
      const developersIds = updateProjectInput?.developers;
      const developers = await this.developerRepository.findByIds(developersIds);
      updateProject.developers = developers;

      const project = await this.projectRepository.preload(updateProject);
      if (project) {
        return this.projectRepository.save(project);
      }
    } else {
      const projectPreload = await this.projectRepository.findOne({ where: { id }, relations: ['developers'] });      
      updateProject.developers = projectPreload.developers;
      
      const project = await this.projectRepository.preload(updateProject);
      if (project) {
        return this.projectRepository.save(project);
      }
    }
  }
}
