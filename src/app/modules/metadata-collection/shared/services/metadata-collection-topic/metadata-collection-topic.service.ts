import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';

@Injectable({
  providedIn: 'root'
})
export class MetadataCollectionTopicService {

  private subprinciples: string[] = [];
  private currentPrinciple?: EDesignAspect;
  subprinciplesBS = new BehaviorSubject(this.subprinciples);

  constructor(
    private feedbackUnitsService: FeedbackUnitsService,
  ) {
  }

  initCurrentPrinciple(currentPrinciple: EDesignAspect) {
    this.currentPrinciple = currentPrinciple;
    return this.feedbackUnitsService.fetchTopicsForAspect(currentPrinciple)
      .pipe(tap(x => {
        this.subprinciples = x;
        this.subprinciplesBS.next(this.subprinciples);
      }))
  }

  addNewTopic(newTopic: string) {
    if (this.currentPrinciple) {
      this.subprinciples.push(newTopic);
      this.subprinciplesBS.next(this.subprinciples);
      return this.feedbackUnitsService.createNewTopicForAspect(this.currentPrinciple, newTopic);
    } else {
      throw new Error('Please initialize current principle');
    }
  }
  
}
