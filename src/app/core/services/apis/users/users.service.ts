import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  fetchUserById(id: string) {
    const userApi = `api/users/${id}`;
    return this.http.get(userApi);
  }

  fetchUserRatedProjects(id: string): Observable<IUserRatedProjectsDict> {
    const userApi = `api/users/${id}/rated-projects`;
    return this.http.get<IInternalUserRatedProjects[]>(userApi).pipe(map(x => {
      const dict: IUserRatedProjectsDict = {};
      x.forEach(x => dict[x._id] = x.hasComplete);
      return dict;
    }));
  }
}

interface IInternalUserRatedProjects {
  _id: string;
  hasComplete: boolean;
}

export interface IUserRatedProjectsDict {
  [_id: string]: boolean;
}