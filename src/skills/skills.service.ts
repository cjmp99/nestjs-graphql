import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillInput } from './dto/create-skill.input';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) { }

  create(createSkillInput: CreateSkillInput) {
    const newSkill = new Skill();
    newSkill.name = createSkillInput.name;

    return this.skillRepository.save(newSkill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOne({ where: { id } });
  }
}
