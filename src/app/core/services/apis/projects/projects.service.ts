import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Observable } from 'rxjs';
import { IPagination } from '../../models/pagination.model';
import { IProject } from '../../models/project.model';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private http: HttpClient) { }

  fetchAllProjects(skip: number = 0, limit: number = 10, projectFilter?: ProjectFilterDto): Observable<IPagination<IProject>> {
    let projectListApi = `api/projects?skip=${skip}&limit=${limit}`;
    if (projectFilter?.categories?.length) {
      projectListApi = projectListApi + `${
        projectFilter.categories.length > 0 ?
        '&categories='+projectFilter.categories?.map(g => `${g}`).join(',') : ''}`;
    }
    if (projectFilter?.amountOfText?.length) {
      projectListApi = projectListApi + `${
        projectFilter.amountOfText.length > 0 ?
        '&amountOfText='+projectFilter.amountOfText?.map(g => `${g}`).join(',') : ''}`;
    }
    return this.http.get<IPagination<IProject>>(projectListApi,{headers: {'Content-Type':'application/json; charset=utf-8'}});
  }
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

  @IsBoolean()
  @IsOptional()
  imageUsage?: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  amountOfText?: number[];

  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(1)
  averageOfOverallQuality?: number;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  subaspects?: string[];
}