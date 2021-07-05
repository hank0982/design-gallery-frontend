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
    return this.http.get<IDesign>(designListApi, {headers: {'Content-Type':'application/json; charset=utf-8'}});
  }
}
