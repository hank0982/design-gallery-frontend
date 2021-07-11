import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../../models/pagination.model';
import { CreateRatingDto, IRating } from '../../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {

  constructor(private http: HttpClient) { }

  fetchRatingByRaterIdAndDesignId(raterId: string, designId: string) {
    const ratingApi = `api/ratings?raterId=${raterId}&designId=${designId}&limit=0`;
    return this.http.get<IPagination<IRating>>(ratingApi);
  }

  createOrUpdateRating(createRatingDto: CreateRatingDto) {
    const ratingApi = `api/ratings`;
    return this.http.post<IRating>(ratingApi, createRatingDto);
  }
}
