import { Component, OnInit } from '@angular/core';
import { ProjectFilterDto, ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { IProject } from 'src/app/core/services/models/project.model';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { forkJoin, Observable, zip } from 'rxjs';
import { IDesign } from 'src/app/core/services/models/design.model';
import { first, map, switchMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {
  readonly categoryFilters = ['Advertising', 'Informative', 'Event', 'Research'];
  readonly textProportion = ['Plenty', 'Moderate', 'Minimal', 'None'];
  readonly textQuantity = ['Plenty', 'Moderate', 'Minimal', 'None'];

  projects: IProject[] = [];
  designDictionary: Record<string, IDesign> = {}
  categories: string[] = [];
  textProportionFilter: number[] = [];
  isEvent: boolean = false;
  previousProjectSkip = 0;

  designPrinciples = Object.values(EDesignAspect);
  constructor(
    private designService: DesignsService,
    private projectService: ProjectsService
  ) { }
  
  ngOnInit(): void {
    this.projectService.fetchAllProjects(0, 10).subscribe(projects => this.projects = projects.results);
    this.previousProjectSkip = 10;
  }

  fetchDesign(designId: string): Observable<IDesign> {
    return this.designService.fetchDesignById(designId).pipe(first())
  }

  categoryChange(e: Event, category: string) {
    if ((e.target as HTMLInputElement).checked) {
      if (!(category in this.categories)) {
        this.categories.push(category);
      }
    } else {
      this.categories = this.categories.filter(x => x !== category);
    }
    this.updateCurrentProject();
  }

  amountOfTextChange(e: Event, amountOfText: number) {
    const textProportion = this.textProportion.length - amountOfText - 1;
    if ((e.target as HTMLInputElement).checked) {
      if (!(textProportion in this.textProportionFilter)) {
        this.textProportionFilter.push(textProportion);
      }
    } else {
      this.textProportionFilter = this.textProportionFilter.filter(x => x !== textProportion);
    }
    this.updateCurrentProject();
  }


  onScroll() {
    const filters = this.getCurrentFilters();
    this.projectService.fetchAllProjects(this.previousProjectSkip, 10, filters).subscribe(projects => this.projects = this.projects.concat(projects.results))
    this.previousProjectSkip = this.previousProjectSkip + 10 ;
  }


  private updateCurrentProject() {
    const filters = this.getCurrentFilters();
    this.projectService.fetchAllProjects(0, 10, filters).subscribe(projects => this.projects = projects.results)
    this.previousProjectSkip = 10;
  }

  private getCurrentFilters() {
    const projectFilterDto = plainToClass(ProjectFilterDto, {
      categories: this.categories.filter(x => x !== undefined) as string[],
      textProportion: this.textProportionFilter,
    })
    return projectFilterDto;
  }
}
