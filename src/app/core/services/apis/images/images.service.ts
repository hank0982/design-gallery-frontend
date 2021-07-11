import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IImage } from '../../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private http: HttpClient) { }

  fetchImageById(id: string) {
    const imageApi = `api/images/${id}`;
    return this.http.get<IImage>(imageApi);
  }
}
