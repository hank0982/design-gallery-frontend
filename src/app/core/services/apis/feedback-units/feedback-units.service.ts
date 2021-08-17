import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IsMongoId, IsOptional } from 'class-validator';
import { EDesignAspect } from '../../models/design-aspect.enum';
import { CreateFeedbackUnitDto, IFeedbackUnit } from '../../models/feedback-unit.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackUnitsService {

  constructor(private http: HttpClient) { }

  updateFeedbackUnit(id: string, newPayload: Partial<CreateFeedbackUnitDto>) {
    let feedbackUnitApi = `api/feedback-units/${id}`;
    return this.http.patch(feedbackUnitApi, newPayload);
  }

  fetchFeedbackUnits(feedbackQuery?: FeedbackQueryDto) {
    let feedbackUnitApi = `api/feedback-units`;
    if (feedbackQuery?.designId) {
      feedbackUnitApi = feedbackUnitApi + `?designId=${feedbackQuery.designId}`;
    }
    return this.http.get<IFeedbackUnit[]>(feedbackUnitApi);
  }

  createFeedbackUnit(createFeedbackUnitDto: CreateFeedbackUnitDto) {
    const feedbackUnitApi = `api/feedback-units`;
    return this.http.post(feedbackUnitApi, createFeedbackUnitDto);
  }

  fetchTopicsForAspect(aspect: EDesignAspect) {
    const topicApi = `api/feedback-units/topics/${aspect}`;
    return this.http.get<string[]>(topicApi);
  }

  createNewTopicForAspect(aspect: EDesignAspect, topic: string) {
    const topicApi =  `api/feedback-units/topics/${aspect}`;
    return this.http.post<string[]>(topicApi, {topic});
  }

}

export class FeedbackQueryDto {
  @IsMongoId()
  @IsOptional()
  designId?: string;

  @IsMongoId()
  feedbackProviderId?: string;
}