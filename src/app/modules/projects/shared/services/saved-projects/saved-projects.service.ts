import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProject } from 'src/app/core/services/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class SavedProjectsService {
  currentSavedProjects: IProject[] = [];
  currentSavedProjectsBS = new BehaviorSubject<IProject[]>([]);
  constructor() { }
  
  addNewProject(newProject: IProject) {
    if ((this.currentSavedProjects.findIndex(x => x._id === newProject._id) === -1)) {
      this.currentSavedProjects.push(newProject);
      this.currentSavedProjectsBS.next(this.currentSavedProjects);
    }
  }

  removeAddedProject(addedProject: IProject) {
    this.currentSavedProjects = this.currentSavedProjects.filter(x => x._id !== addedProject._id);
    this.currentSavedProjectsBS.next(this.currentSavedProjects);
  }
}
