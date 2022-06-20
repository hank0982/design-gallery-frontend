import { Injectable } from '@angular/core';
import * as rrweb from 'rrweb';
import { interval, Subscription } from 'rxjs';
import { UserDataService } from 'src/shared/services/user-data/user-data.service';
import { UserActivityService } from '../apis/user-activity/user-activity.service';
@Injectable({
  providedIn: 'root'
})
export class RecordService {
  recordItems: any[] = [];
  recorder: any;
  timer: Subscription | undefined;
  constructor(
    private userActivityService: UserActivityService,
    private userDataService: UserDataService,
  ) { }

  startRecording() {
    const that = this;
    this.recorder = rrweb.record({
      emit(event) {
        that.recordItems.push(event);
      },
    });

    this.userDataService.userInfo.subscribe(data => {
      if (data) {
        this.timer = interval(100).subscribe(_ => {
          this.userActivityService.updateUserActivity(data._id, this.recordItems);


          // lock
          this.recordItems = [];


        });
      }
    });
  }

  stopRecording() {
    this.timer?.unsubscribe();
    this.recorder();
  }
}
