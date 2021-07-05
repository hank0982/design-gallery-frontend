import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecordService } from './core/services/record/record.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  constructor(private recordService: RecordService) {}
  
  ngOnInit(): void {
    this.recordService.startRecording();
  }

  replay(): void {
    this.recordService.stopRecording();
  }
}
