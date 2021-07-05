import { Injectable } from '@angular/core';
import * as rrweb from 'rrweb';
@Injectable({
  providedIn: 'root'
})
export class RecordService {
  recordItems: any[] = [];
  recorder: any;
  constructor() { }

  startRecording() {
    const that = this;
    this.recorder = rrweb.record({
      emit(event) {
        that.recordItems.push(event);
      },
    });
  }

  stopRecording() {
    this.recorder();
  }
}
