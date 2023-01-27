import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Developer } from 'src/developers/entities/developer.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Developer) private developerRepository: Repository<Developer>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) { }

  findAll(id?: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        id: id
      },
      relations: ['developers', 'skills'],
    });
  }

  async filterByRole(role?: string): Promise<Project[]> {
    const gettingRoles = await this.skillRepository.find({
      where: {
        name: role
      },
      relations: ['developers', 'projects'],
    });

    return gettingRoles[0].projects;
  }

  findById(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ['developers', 'skills']
    });
  }

  findAllDevelopers(ids?: Developer[]): Promise<Developer[]> {
    return this.developerRepository.findByIds(
      ids,
    );
  }

  findAllSkills(ids?: Skill[]): Promise<Skill[]> {
    return this.skillRepository.findByIds(
      ids,
    );
  }

  async createProject(project: CreateProjectInput): Promise<Project> {
    const newProject = new Project();
    newProject.name = project?.name;
    newProject.description = project?.description;
    newProject.status = project?.status;

    if (project?.skills) {
      const skillsIds = project?.skills;

      const skills = await this.skillRepository.findByIds(skillsIds);

      newProject.skills = skills;
      newProject.developers = [];
      return this.projectRepository.save(newProject);
    } else {
      newProject.developers = [];
      newProject.skills = [];
      return this.projectRepository.save(newProject);
    }
  }

  async update(id: number, updateProjectInput: UpdateProjectInput): Promise<Project> {
    const updateProject = new Project();
    updateProject.id = id;
    updateProject.name = updateProjectInput.name;
    updateProject.description = updateProjectInput.description;
    updateProject.status = updateProjectInput?.status;
    const projectPreload = await this.projectRepository.findOne({ where: { id }, relations: ['developers', 'skills'] });

    if (updateProjectInput?.developers) {
      const developersIds = updateProjectInput?.developers;
      const developers = await this.developerRepository.findByIds(developersIds);

      updateProject.developers = projectPreload.developers.concat(developers);
      updateProject.skills = projectPreload?.skills;
      const project = await this.projectRepository.preload(updateProject);

      if (project) {
        const responseDuplicate = developers.map(async dev => {
          const devPreload = await this.developerRepository.findOne({ where: { id: dev.id }, relations: ['skills'] });

          const newArray = devPreload.skills.concat(projectPreload.skills);

          const searching = newArray.reduce((acc, skill) => {
            acc[skill.id] = ++acc[skill.id] || 0;
            return acc;
          }, {});

          const duplicate = newArray.filter((skill) => {

            return searching[skill.id];
          });
          return duplicate
        });
        const resolvePromise = await responseDuplicate[0];

        if (resolvePromise?.length !== 0) {
          return this.projectRepository.save(project)
        } else {
          throw new BadRequestException("The developer don't haven't skills to join project");
        }
      }
    } else if (updateProjectInput?.skills) {
      const skillsIds = updateProjectInput?.skills;
      const skills = await this.skillRepository.findByIds(skillsIds);

      updateProject.skills = skills;
      updateProject.developers = projectPreload.developers
      const project = await this.projectRepository.preload(updateProject);
      if (project) {
        return this.projectRepository.save(project);
      }
    } else {
      const projectPreload = await this.projectRepository.findOne({ where: { id }, relations: ['developers', 'skills'] });
      updateProject.developers = projectPreload.developers;
      updateProject.skills = projectPreload.skills;

      const project = await this.projectRepository.preload(updateProject);

      if (project) {
        return this.projectRepository.save(project);
      }
    }
  }

}