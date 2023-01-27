import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Developer } from "src/developers/entities/developer.entity";

@InputType()
export class CreateProjectInput {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Field()
  name: string;

  @MaxLength(100)
  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: true })
  status?: boolean;

  @Field(() => [Int], { nullable: true })
  developers?: number[];
}