import { Mutation, Query, Resolver, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Developer } from 'src/developers/entities/developer.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/projects.entity';
import { ProjectsService } from './projects.service';

@Resolver((of) => Project)
export class ProjectsResolver {
  constructor(private projectService: ProjectsService) { }

  @Query(() => [Project])
  projects() {
    return this.projectService.findAll();
  }

  @Query(() => Project)
  projectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findById(id);
  }

  @Mutation(() => Project)
  createProject(@Args('projectInput') projectInput: CreateProjectInput) {
    return this.projectService.createProject(projectInput);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectService.update(updateProjectInput.id, updateProjectInput);
  }

  @ResolveField(() => Developer)
  async developers(@Parent() project: Project) {
    return await this.projectService.findAllDevelopers(project.developers);
  }
}
