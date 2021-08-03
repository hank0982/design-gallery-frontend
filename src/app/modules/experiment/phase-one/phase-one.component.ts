import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { IQuizResult } from 'src/app/core/services/models/user.model';
import { PhaseStepService } from '../services/phase-step/phase-step.service';

@Component({
  templateUrl: './phase-one.component.html',
  styleUrls: ['./phase-one.component.sass']
})
export class PhaseOneComponent implements OnInit {
  quizzes: IQuiz[] = []
  condition = 1;

  isQuizSubmitButtonClick = false;
  hasUserReviewedTheDef = false;
  constructor(
    private usersService: UsersService,
    private phaseStepService: PhaseStepService,
  ) { }

  ngOnInit(): void {
    this.generateQuizzes()
  }

  get step() {
    return this.phaseStepService.currentStep;
  }

  addOneMoreStep() {
    this.phaseStepService.proceedOneMoreStep();
  }
  
  private generateQuizzes() {
    const imgSrcs = ['https://fakeimg.pl/230x330/', 'https://fakeimg.pl/230x330/', 'https://fakeimg.pl/230x330/', 'https://fakeimg.pl/230x330/', 'https://fakeimg.pl/230x330/']
    this.quizzes = imgSrcs.map(src => {
      return {
        imgSrc: src,
        likert: {
          appropriateness: undefined,
          emphasis: undefined,
          hierarchy: undefined,
          alignment: undefined,
          consistency: undefined,
          readability: undefined
        }
      }
    })
  }

  get isQuizFilled() {
    let isQuizFilled = true;
    this.quizzes.forEach(q => isQuizFilled = !!isQuizFilled && !!q.likert.alignment && !!q.likert.appropriateness && !!q.likert.emphasis && !!q.likert.consistency && !!q.likert.hierarchy && !!q.likert.readability);
    return isQuizFilled;
  }

  postUserResult() {
    this.isQuizSubmitButtonClick = true;
    if (this.isQuizFilled && this.phaseStepService.currentUser?.surveyInfo) {
      const newSurveyInfo = this.phaseStepService.currentUser.surveyInfo;
      newSurveyInfo.firstQuizResult = this.quizzes.map(q => q.likert) as IQuizResult[];
      this.phaseStepService.updateSurveyInfo(newSurveyInfo);
      this.usersService.updateSurveyInfo(this.phaseStepService.currentUser!._id, this.phaseStepService.currentUser!.surveyInfo!).subscribe(_=> {
        this.phaseStepService.proceedOneMorePhase();
      });
    }
  }
}

interface IQuiz {
  imgSrc: string;
  likert: {
    appropriateness?: number;
    emphasis?: number;
    hierarchy?: number;
    alignment?: number;
    consistency?: number;
    readability?: number;
  }
}