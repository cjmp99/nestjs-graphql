import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDeveloperInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => [Int], { nullable: true })
  projects?: number[];

  @Field(() => [Int], { nullable: true })
  skills?: number[];
}
