import { IMongoObject } from "./mongo-object.model";

export interface IDesign extends IMongoObject {
  feedback: string[];
  name: string;
  imageUrl?: string;
  imageId?: string;
  projectId: string;
  version: number,
  amountOfText: number,
}