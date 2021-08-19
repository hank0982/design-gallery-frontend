import { Component, OnInit } from '@angular/core';
import { ProjectFilterDto, ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { IProject } from 'src/app/core/services/models/project.model';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { forkJoin, Observable, zip } from 'rxjs';
import { EDesignImageUsages, IDesign } from 'src/app/core/services/models/design.model';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { HSLA, HSVA, RGBA } from 'ngx-color';
import { SavedProjectsService } from '../shared/services/saved-projects/saved-projects.service';

@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {
  constructor(
    private savedProjectsService: SavedProjectsService
  ) {}

  ngOnInit() {

  }

  get currentSavedProjectNumber$() {
    return this.savedProjectsService.currentSavedProjectsBS.asObservable().pipe(map(x => x.length));
  }

}
