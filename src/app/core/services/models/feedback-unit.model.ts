import { IsString, IsEnum, IsBoolean } from "class-validator";
import { EDesignAspect } from "./design-aspect.enum";

export interface IFeedbackUnit {
  designId: string;
  feedbackProviderId: string;
  content: string;
  aspect: EDesignAspect;
  subaspect: string;
  isPositive: boolean;
  addressed: boolean;
}

export class CreateFeedbackUnitDto {
  @IsString()
  designId!: string;

  @IsString()
  feedbackProviderId!: string;

  @IsString()
  content!: string;

  @IsEnum(EDesignAspect)
  aspect!: EDesignAspect;

  @IsString()
  subaspect!: string;

  @IsBoolean()
  addressed!: boolean;

  @IsBoolean()
  isPositive!: boolean;
}
