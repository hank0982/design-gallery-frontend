import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectFilterDto, ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { IProject } from 'src/app/core/services/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectListService {
  private previousProjectSkip = 0;
  currentProjectFilter?: ProjectFilterDto = undefined;
  currentProjectFilterBS = new BehaviorSubject<ProjectFilterDto | undefined>(undefined);
  currentProjects: IProject[] = [];
  currentProjectsBS = new BehaviorSubject<IProject[]>([]);
  constructor(
    private projectService: ProjectsService,
  ) { }

  updateCurrentFilters(newFilter: ProjectFilterDto) {
    this.currentProjects = [];
    this.currentProjectsBS.next([]);
    this.currentProjectFilter = newFilter;
    this.currentProjectFilterBS.next(this.currentProjectFilter);
    this.previousProjectSkip = 0;
    this.updateCurrentProject();
  }

  init() {
    this.projectService.fetchAllProjects(0, 10).subscribe(projects => {
      this.currentProjects = projects.results;
      this.currentProjectsBS.next(this.currentProjects)
    });
    this.previousProjectSkip = 10;
  }

  updateCurrentProject() {

    this.projectService.fetchAllProjects(this.previousProjectSkip, 10, this.currentProjectFilter)
      .subscribe(
        projects => {
          this.currentProjects = this.currentProjects.concat(projects.results);
          this.currentProjectsBS.next(this.currentProjects)
        }
      )
    this.previousProjectSkip = this.previousProjectSkip + 10 ;
  }
}
