import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { Project } from 'src/projects/entities/projects.entity';
import { Skill } from 'src/skills/entities/skill.entity';

@Resolver(() => Developer)
export class DevelopersResolver {
  constructor(private readonly developersService: DevelopersService) { }

  @Mutation(() => Developer)
  createDeveloper(@Args('createDeveloperInput') createDeveloperInput: CreateDeveloperInput) {
    return this.developersService.create(createDeveloperInput);
  }

  @Query(() => [Developer])
  developers(@Args('role', { nullable: true }) role: string) {
    if(role) {
      return this.developersService.filterByRole(role);
    }else{
      return this.developersService.findAll();
    }
  }

  @Query(() => Developer)
  developer(@Args('id', { type: () => Int }) id: number) {
    return this.developersService.findById(id);
  }

  @Mutation(() => Developer)
  updateDeveloper(@Args('updateDeveloperInput') updateDeveloperInput: UpdateDeveloperInput) {
    return this.developersService.update(updateDeveloperInput.id, updateDeveloperInput);
  }

  @ResolveField(() => Project)
  async projects(@Parent() dev: Developer) {
    return await this.developersService.findAllProjects(dev.projects);
  }

  @ResolveField(() => Skill)
  async skills(@Parent() dev: Developer) {
    return await this.developersService.findAllSkills(dev.skills);
  }

  // @Mutation(() => Developer)
  // removeDeveloper(@Args('id', { type: () => Int }) id: number) {
  //   return this.developersService.remove(id);
  // }
}
