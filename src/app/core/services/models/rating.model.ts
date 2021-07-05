import { IsEnum, IsMongoId, IsNumber } from "class-validator";
import { EDesignAspect } from "./design-aspect.enum";
import { IMongoObject } from "./mongo-object.model";

export interface IRating extends IMongoObject {
  raterId: string;
  designId: string;
  rating: {
    EMPHASIS: number;
    APPROPRIATENESS: number;
    ALIGNMENT: number;
    HIERARCHY: number;
    CONSISTENCY: number;
    READABILITY: number;
  },
}

export class CreateRatingDto {
  @IsMongoId()
  designId!: string;

  @IsMongoId()
  raterId!: string;

  @IsEnum(EDesignAspect)
  aspect!: EDesignAspect;

  @IsNumber()
  rating!: number;
}