import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EDesignAspect } from '../../models/design-aspect.enum';
import { CreateFeedbackUnitDto } from '../../models/feedback-unit.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackUnitsService {

  constructor(private http: HttpClient) { }

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
