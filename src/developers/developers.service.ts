import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/projects.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { Developer } from './entities/developer.entity';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer) private developerRepository: Repository<Developer>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) { }

  findAll(id?: number): Promise<Developer[]> {
    return this.developerRepository.find({
      where: {
        id
      },
      relations: ['projects', 'skills']
    });
  }

  findAllProjects(ids?: Project[]): Promise<Project[]> {
    return this.projectRepository.findByIds(
      ids,
    );
  }

  findAllSkills(ids?: Skill[]): Promise<Skill[]> {
    return this.skillRepository.findByIds(
      ids,
    );
  }

  async filterByRole(role?: string): Promise<Developer[]> {
    const gettingRoles = await this.skillRepository.find({
      where: {
        name: role
      },
      relations: ['developers', 'projects'],
    });

    return gettingRoles[0].developers;
  }

  findById(id: number): Promise<Developer> {
    return this.developerRepository.findOne({
      where: {
        id,
      },
      relations: ['projects']
    });
  }

  async create(createDeveloperInput: CreateDeveloperInput): Promise<Developer> {
    const newDeveloper = new Developer();
    newDeveloper.name = createDeveloperInput.name;
    newDeveloper.email = createDeveloperInput.email;
    if (createDeveloperInput?.skills) {
      const skillIds = createDeveloperInput.skills;
      const skills = await this.skillRepository.findByIds(skillIds);
      newDeveloper.skills = skills;
      return this.developerRepository.save(newDeveloper);
    } else {
      return this.developerRepository.save(newDeveloper);
    }
  }

  async update(id: number, updateDeveloperInput: UpdateDeveloperInput): Promise<Developer> {
    const updateDeveloper = new Developer();
    updateDeveloper.id = id;
    updateDeveloper.name = updateDeveloperInput.name;
    updateDeveloper.email = updateDeveloperInput.email;
    const devPreload = await this.developerRepository.findOne({ where: { id }, relations: ['projects', 'skills'] });

    if (updateDeveloperInput?.skills) {
      const skillsIds = updateDeveloperInput.skills;
      const skills = await this.skillRepository.findByIds(skillsIds);
      updateDeveloper.skills = skills;
      updateDeveloper.projects = devPreload.projects;
      const dev = await this.developerRepository.preload(updateDeveloper);
      if (dev) {
        return this.developerRepository.save(dev);
      }

    } else {
      updateDeveloper.projects = devPreload?.projects;
      updateDeveloper.skills = devPreload.skills;

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
