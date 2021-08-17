import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { ICreateUser, IQuizResult, ISurveyInfo, IUser } from '../../models/user.model';
import { IRatedProject } from '../projects/projects.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  fetchById(id: string) {
    const userApi = `api/users/id/${id}`;
    return this.http.get<IUser>(userApi);
  }

  updateName(id: string, newName: string) {
    const userApi = `api/users/${id}`;
    return this.http.patch(userApi, {name: newName})
  }

  registerSurveyUser(surveyUserPayload: ICreateUser) {
    const userApi = 'api/users';
    return this.http.post<IUser>(userApi, surveyUserPayload);
  }

  updateSurveyInfo(id: string, newSurveyInfo: ISurveyInfo) {
    const userApi = `api/users/${id}`;
    return this.http.patch(userApi, {surveyInfo: newSurveyInfo});
  }

  ratedProjects(userId: string) {
    const ratedProjectApi = `api/users/${userId}/rated-projects`;
    return this.http.get<IRatedProjectInternal[]>(ratedProjectApi).pipe(mergeMap(x => {
      const dict = {} as IRatedProject;
      x.forEach(x => {
        dict[x._id] = x.hasComplete;
      });
      return of(dict);
    }));
  }
}

interface IRatedProjectInternal {
  _id: string;
  hasComplete: boolean;
}