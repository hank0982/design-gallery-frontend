import { IMongoObject } from "./mongo-object.model";

export interface IUser extends IMongoObject {
    name: string;
  
    username: string;
  
    projectIds: string[];
  
    ratingIds: string[];
  
    feedbackUnitIds: string[];
  
    surveyInfo?: ISurveyInfo;
}

export interface ICreateUser {
    name: string;
  
    password: string;
  
    username: string;
  
    surveyInfo?: ISurveyInfo;
}

enum EGender {
  MALE='MALE',
  FEMALE='FEMALE',
  OTHER='OTHER'
}

enum EDesignBackground {
  NONE='NONE',
  SELF_TAUGHT='SELF_TAUGHT',
  SOME_COURSES='SOME_COURSES',
  ASSOCIATE_DEGREE='ASSOCIATE_DEGREE',
  BACHELOR='BACHELOR',
  MASTER='MASTER'
}

enum EYearsOfProfessionalExperience {
  NONE='NONE',
  LESS_THAN_ONE='LESS_THAN_ONE',
  ONE_TO_THREE='ONE_TO_THREE',
  THREE_TO_FIVE='THREE_TO_FIVE',
  MORE_THAN_FIVE='MORE_THAN_FIVE'
}

export interface IQuizResult {
  appropriateness: number;
  emphasis: number;
  hierarchy: number;
  alignment: number;
  consistency: number;
  readability: number;
}

export interface ISurveyInfo {
  // 0 will be demography
  // 1 will be phase 1
  // ...
  currentPhase: number;
  
  currentStep: number;

  age: number;
  
  gender: EGender;

  email: string;

  levelOfExpertise: number;

  designEducationBackground: EDesignBackground;
  
  yearsOfProfessionalExperience: EYearsOfProfessionalExperience;

  infoSource?: string;

  firstQuizResult?: IQuizResult[];
  
  finalQuizResult?: IQuizResult[];
  
  firstDesignId?: string;

  finalDesignId?: string;

  phaseTwoSurvey?: IPhaseTwoSurvey;
}

export interface IPhaseTwoSurvey {
  time: string;
  effort: number;
  confidence: number;
  selfEval: {
    appropriateness: number;
    hierarchy: number;
    emphasis: number;
    readability: number;
    consistency: number;
    alignment: number;
  };
  implementedParticularlyWell: number;
  struggleMost: number;
}