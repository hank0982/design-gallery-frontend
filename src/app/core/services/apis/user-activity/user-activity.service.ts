import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IUserActivity, IUserActivityCreateDto, IUserActivityUpdateDto } from '../../models/user-activity.model';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {

  currentUserActivitySession: IUserActivity | undefined;

  constructor(private http: HttpClient) { }
  
  fetchById(activityId: string) {
    const userActivityApi = `api/user-activity/${activityId}`;
    return this.http.get<IUserActivity>(userActivityApi);
  }

  updateUserActivity(userId: string, newLogs: any[]) {
    if (!this.currentUserActivitySession) {
      this.createUserActivitySession(userId).subscribe(session => {
        this.currentUserActivitySession = session;
        this.appendUserActivitySession(session._id, userId, newLogs);
      });
    } else {
      console.log(newLogs);
      this.appendUserActivitySession(this.currentUserActivitySession._id, userId, newLogs);
    }
  }

  private createUserActivitySession(userId: string) {
    const userActivityApi = `api/user-activity`;
    const userActivityCreateDto: IUserActivityCreateDto = {userId};
    return this.http.post<IUserActivity>(userActivityApi, userActivityCreateDto);
  }

  private appendUserActivitySession(activityId: string, userId: string, logs: any[]) {
    if (logs.length > 0) {
      const userActivityApi = `api/user-activity/${activityId}`;
      const userActivityUpdateDto: IUserActivityUpdateDto = {userId, logs};
      this.http.patch<IUserActivity>(userActivityApi, userActivityUpdateDto).subscribe();
    }
  }
}
