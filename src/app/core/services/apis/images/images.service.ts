import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IImage } from '../../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private http: HttpClient) { }
  private imageCache: {
    [id: string]: IImage
  } = {};

  fetchImageById(id: string) {
    const imageApi = `api/images/${id}`;
    if (id in this.imageCache) {
      return of(this.imageCache[id])
    } else {
      return this.http.get<IImage>(imageApi).pipe(tap(x => this.imageCache[x._id] = x));
    }
  }
}
