import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { RecordService } from 'src/app/core/services/record/record.service';
import { SavedProjectsService } from '../shared/services/saved-projects/saved-projects.service';

@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  constructor(
    private savedProjectsService: SavedProjectsService,
    private recordService: RecordService,
  ) {}

  ngOnInit() {
    this.recordService.startRecording();
  }
  
  ngOnDestroy() {
    this.recordService.stopRecording();
  }

  get currentSavedProjectNumber$() {
    return this.savedProjectsService.currentSavedProjectsBS.asObservable().pipe(map(x => x.length));
  }
}
