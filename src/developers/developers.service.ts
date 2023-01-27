import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/projects.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { Repository } from 'typeorm';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { Developer } from './entities/developer.entity';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer) private developerRepository: Repository<Developer>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) { }

  async create(createDeveloperInput: CreateDeveloperInput): Promise<Developer> {
    const newDeveloper = new Developer();
    newDeveloper.name = createDeveloperInput.name;
    newDeveloper.email = createDeveloperInput.email;
    if (createDeveloperInput?.projects) {
      const projectsIds = createDeveloperInput.projects;
      const projects = await this.projectRepository.findByIds(projectsIds);
      newDeveloper.projects = projects;
      return this.developerRepository.save(newDeveloper);
    } else {
      return this.developerRepository.save(newDeveloper);
    }
  }

  findAll(id?: number): Promise<Developer[]> {
    return this.developerRepository.find({
      where: {
        id
      },
      relations: ['projects']
    });
  }

  findAllProjects(ids?: Project[]): Promise<Project[]> {
    return this.projectRepository.findByIds(
      ids,
    );
  }

  findById(id: number): Promise<Developer> {
    return this.developerRepository.findOne({
      where: {
        id,
      },
      relations: ['projects']
    });
  }

  async update(id: number, updateDeveloperInput: UpdateDeveloperInput): Promise<Developer> {
    const updateDeveloper = new Developer();
    updateDeveloper.id = id;
    updateDeveloper.name = updateDeveloperInput.name;
    updateDeveloper.email = updateDeveloperInput.email;
    if (updateDeveloperInput?.projects) {
      const projectsIds = updateDeveloperInput.projects;
      const projects = await this.projectRepository.findByIds(projectsIds);
      updateDeveloper.projects = projects;
      
      const dev = await this.developerRepository.preload(updateDeveloper);
      if (dev) {
        return this.developerRepository.save(dev);
      }
    } else {
      const devPreload = await this.developerRepository.findOne({ where: { id }, relations: ['projects'] });      
      updateDeveloper.projects = devPreload.projects;

      const dev = await this.developerRepository.preload(updateDeveloper);
      if (dev) {
        return this.developerRepository.save(dev);
      }
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} developer`;
  // }
}
