import { IMongoObject } from "./mongo-object.model";

export interface IDesign extends IMongoObject {
  feedback: string[];
  name: string;
  imageUrl?: string;
  imageId?: string;
  projectId: string;
  version: number,
  dominantColor: string;
  mainColor: string;
  overallQuality: number;
  rational: string;
  textProportion: number;
  textQuantity: number;
  imageUsage: EDesignImageUsages;
}

export enum EDesignImageUsages {
  ILLUSTRATION = 'ILLUSTRATION',
  PHOTO = 'PHOTO',
  BOTH = 'BOTH',
  NONE = 'NONE'
}
