import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { CreateDeveloperInput } from './dto/create-developer.input';
import { UpdateDeveloperInput } from './dto/update-developer.input';
import { Project } from 'src/projects/entities/projects.entity';

@Resolver((of) => Developer)
export class DevelopersResolver {
  constructor(private readonly developersService: DevelopersService) { }

  @Mutation(() => Developer)
  createDeveloper(@Args('createDeveloperInput') createDeveloperInput: CreateDeveloperInput) {
    return this.developersService.create(createDeveloperInput);
  }

  @Query(() => [Developer])
  developers() {
    return this.developersService.findAll();
  }

  @Query(() => Developer)
  developer(@Args('id', { type: () => Int }) id: number) {
    return this.developersService.findById(id);
  }

  @ResolveField(() => Project)
  async projects(@Parent() dev: Developer) {
    return await this.developersService.findAllProjects(dev.projects);
  }

  @Mutation(() => Developer)
  updateDeveloper(@Args('updateDeveloperInput') updateDeveloperInput: UpdateDeveloperInput) {
    return this.developersService.update(updateDeveloperInput.id, updateDeveloperInput);
  }

  // @Mutation(() => Developer)
  // removeDeveloper(@Args('id', { type: () => Int }) id: number) {
  //   return this.developersService.remove(id);
  // }
}
