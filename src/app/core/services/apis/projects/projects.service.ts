import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EDesignAspect } from '../../models/design-aspect.enum';
import { EDesignImageUsages } from '../../models/design.model';
import { IFeedbackUnit } from '../../models/feedback-unit.model';
import { IPagination } from '../../models/pagination.model';
import { IProject } from '../../models/project.model';
import { IRating } from '../../models/rating.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private http: HttpClient) { }
  private projectCache: {
    [id: string]: IProject
  } = {};
  fetchProjectById(id: string) {
    if (id in this.projectCache) {
      return of(this.projectCache[id])
    } else {
      return this.http.get<IProject>(`api/projects/${id}`).pipe(tap(x => this.projectCache[x._id] = x));
    }
  }

  fetchAllProjects(skip: number = 0, limit: number = 10, projectFilter?: ProjectFilterDto): Observable<IPagination<IProject>> {
    let projectListApi = `api/projects?skip=${skip}&limit=${limit}`;
    if (projectFilter?.categories?.length) {
      projectListApi = projectListApi + `${
        projectFilter.categories.length > 0 ?
        '&categories='+projectFilter.categories?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.textProportion?.length) {
      projectListApi = projectListApi + `${
        projectFilter.textProportion.length > 0 ?
        '&textProportion='+projectFilter.textProportion?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.textQuantity?.length) {
      projectListApi = projectListApi + `${
        projectFilter.textQuantity.length > 0 ?
        '&textQuantity='+projectFilter.textQuantity?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.imageUsage?.length) {
      projectListApi = projectListApi + `${
        projectFilter.imageUsage.length > 0 ?
        '&imageUsage='+projectFilter.imageUsage?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.subaspects?.length) {
      projectListApi = projectListApi + `${
        projectFilter.subaspects.length > 0 ?
        '&subaspects='+projectFilter.subaspects?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.dominantColor) {
      projectListApi = projectListApi + `${'&dominantColor='+projectFilter.dominantColor.slice(1)}`;
    }
    if (projectFilter?.mainColor) {
      projectListApi = projectListApi + `${'&mainColor='+projectFilter.mainColor.slice(1)}`;
    }
    return this.http.get<IPagination<IProject>>(projectListApi,{headers: {'Content-Type':'application/json; charset=utf-8'}});
  }

  fetchRatedProjects(aspect: EDesignAspect) {
    const ratedProjectApi = `api/projects/rated-project-aspect/${aspect}`;
    return this.http.get<IInternalUserRatedProject[]>(ratedProjectApi).pipe(map(x => {
      const dict: IRatedProject = {};
      x.forEach(x => dict[x._id] = x.hasCompleted);
      return dict;
    }));
  }

  fetchFeedbackAndRatings(projectId: string, aspect: EDesignAspect): Observable<IFeedbackAndRatings> {
    const feedbackAndRatings = `api/projects/${projectId}/feedback-ratings`;
    return this.http.get<IInternalFeedbackAndRating>(feedbackAndRatings).pipe(map(x => {
      return {
        ratings: x.rating,
        feedbackUnits: x.feedbackUnitResult.filter(unit => unit.aspect === aspect)
      }
    }));
  }
}

interface IInternalUserRatedProject {
  _id: string;
  hasCompleted: boolean;
}

interface IInternalFeedbackAndRating {
  rating: IRating[],
  feedbackUnitResult: IFeedbackUnit[]
}

export interface IFeedbackAndRatings {
  ratings: IRating[],
  feedbackUnits: IFeedbackUnit[]
}

export interface IRatedProject {
  [_id: string]: boolean;
}

export class ProjectFilterDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  sources?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUsage?: EDesignImageUsages[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  textQuantity?: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  textProportion?: number[];

  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(1)
  averageOfOverallQuality?: number;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  subaspects?: string[];

  @IsString()
  @IsOptional()
  mainColor?: string;

  @IsString()
  @IsOptional()
  dominantColor?: string;
}