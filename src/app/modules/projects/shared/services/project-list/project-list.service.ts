import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { IProject } from 'src/app/core/services/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectListService {
  private previousProjectSkip = 0;

  currentProjects: IProject[] = [];
  currentProjectsBS = new BehaviorSubject<IProject[]>([]);
  constructor(
    private projectService: ProjectsService,
  ) { }

  init() {
    this.projectService.fetchAllProjects(0, 10).subscribe(projects => this.currentProjects = projects.results);
    this.previousProjectSkip = 10;
  }

  onScroll() {
    this.projectService.fetchAllProjects(this.previousProjectSkip, 10, filters).subscribe(projects => this.projects = this.projects.concat(projects.results))
    this.previousProjectSkip = this.previousProjectSkip + 10 ;
  }
}
