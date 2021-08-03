import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICreateUser, IQuizResult, ISurveyInfo, IUser } from '../../models/user.model';

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
}


