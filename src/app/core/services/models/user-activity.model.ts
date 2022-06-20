import { IsEnum, IsMongoId, IsNumber } from "class-validator";
import { EDesignAspect } from "./design-aspect.enum";
import { IMongoObject } from "./mongo-object.model";

export interface IUserActivity extends IMongoObject {
  userId: string;
  logs: any[];
}

export interface IUserActivityCreateDto {
  userId: string;
}

export interface IUserActivityUpdateDto {
  userId: string;
  logs: any[];
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