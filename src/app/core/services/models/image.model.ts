import { IMongoObject } from "./mongo-object.model";

export interface IImage extends IMongoObject {
  originalFileName: string;
  url: string;
  thumbnailUrl: string;
  newFileName: string;
  uuid: string;
  size: number;
}