import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IDesign } from '../../models/design.model';

@Injectable({
  providedIn: 'root'
})
export class DesignsService {

  private designCache: {
    [id: string]: IDesign
  } = {};
  constructor(private http: HttpClient) { }

  fetchDesignById(id: string): Observable<IDesign> {
    const designListApi = `api/designs/${id}`;
    if (id in this.designCache) {
      // console.log(id)
      return of(this.designCache[id])
    } else {
      return this.http.get<IDesign>(designListApi).pipe(tap(x => this.designCache[x._id] = x));
    }
  }

  uploadDesign(designFile: File) {
    const imageUploadApi = `api/designs/upload`;
    let data = new FormData();
    data.append('file', designFile);
    return this.http.post(imageUploadApi, data);
  }
}
