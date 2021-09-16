import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
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
