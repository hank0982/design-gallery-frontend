import { Component, OnInit } from '@angular/core';
import { SavedProjectsService } from '../../shared/services/saved-projects/saved-projects.service';

@Component({
  templateUrl: './my-favorite.component.html',
  styleUrls: ['./my-favorite.component.sass']
})
export class MyFavoriteComponent implements OnInit {

  get currentSavedProjects$() {
    return this.savedProjectsService.currentSavedProjectsBS.asObservable();
  }

  constructor(
    private savedProjectsService: SavedProjectsService,
  ) { }

  ngOnInit(): void {
  }

}
