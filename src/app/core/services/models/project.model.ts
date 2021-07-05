import { IMongoObject } from "./mongo-object.model";

export interface IProject extends IMongoObject {
  name: string;
  description: string;
  creator: string | null;
  creatorOffDesignGallery: string | null;
  designIds: string[];
  categories: string[];
  sources: string[];
}
