import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDesign } from '../../models/design.model';

@Injectable({
  providedIn: 'root'
})
export class DesignsService {

  constructor(private http: HttpClient) { }

  fetchDesignById(id: string): Observable<IDesign> {
    const designListApi = `api/designs/${id}`;
    return this.http.get<IDesign>(designListApi);
  }

  uploadDesign(designFile: File) {
    const imageUploadApi = `api/designs/upload`;
    let data = new FormData();
    data.append('file', designFile);
    return this.http.post(imageUploadApi, data);
  }
}
