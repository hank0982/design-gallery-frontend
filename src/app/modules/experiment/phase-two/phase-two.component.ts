import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { IPhaseTwoSurvey, ISurveyInfo } from 'src/app/core/services/models/user.model';
import { PhaseStepService } from '../services/phase-step/phase-step.service';

@Component({
  templateUrl: './phase-two.component.html',
  styleUrls: ['./phase-two.component.sass']
})
export class PhaseTwoComponent implements OnInit {

  get step() {
    return this.phaseStepService.currentStep;
  }

  secondSurvey = {
    time: undefined,
    effort: undefined,
    confidence: undefined,
    selfEval: {
      appropriateness: undefined,
      hierarchy: undefined,
      emphasis: undefined,
      readability: undefined,
      consistency: undefined,
      alignment: undefined,
    },
    implementedParticularlyWell: undefined,
    struggleMost: undefined,
  }

  isSecondSurveySubmitted = false;
  fileData?: File;
  fileUploadingError?: string;
  constructor(
    private usersService: UsersService,
    private designsService: DesignsService,
    private imagesService: ImagesService,
    private phaseStepService: PhaseStepService
  ) { }

  imageSrc$ =  this.phaseStepService.currentUserBS.pipe(mergeMap(x => {
    if (x?.surveyInfo?.firstDesignId) {
      return this.imagesService.fetchImageById(x?.surveyInfo?.firstDesignId).pipe(
        map(x => x.url)
      )
    }
    return of(undefined);
  }));

  ngOnInit(): void {
 
  }

  
  onFileChange(event: Event) {
    this.fileData = (event.target! as any).files[0];
  }

  submitSecondSurvey() {
    this.isSecondSurveySubmitted = true;
    if (this.isSecondSurveyValid() && this.phaseStepService.currentUser?.surveyInfo) {
      const currentUser = this.phaseStepService.currentUserBS.value;
      currentUser!.surveyInfo!.phaseTwoSurvey = this.secondSurvey as any as IPhaseTwoSurvey;
      this.phaseStepService.updateSurveyInfo(currentUser!.surveyInfo!);
      this.usersService.updateSurveyInfo(this.phaseStepService.currentUser!._id, currentUser!.surveyInfo!).subscribe(_=> {
        this.phaseStepService.proceedOneMorePhase();
      });
    }
  }
  
  uploadFile() {
    if(this.fileData) {
      this.designsService.uploadDesign(this.fileData).pipe(
        catchError(err => {
          this.fileUploadingError = 'The file you choose is not valid.';
          throw new Error(err);
        })
      ).subscribe((x: any) => {
        const oldSurveyInfo = {...this.phaseStepService.currentUser?.surveyInfo} as ISurveyInfo;
        oldSurveyInfo.firstDesignId = x._id;

        this.phaseStepService.updateSurveyInfo(oldSurveyInfo);
        this.usersService.updateSurveyInfo(this.phaseStepService.currentUser!._id, oldSurveyInfo).subscribe(_=> {
          this.phaseStepService.proceedOneMoreStep();
        });
      });
    }
  }

  isSelfEvalValid() {
    return this.secondSurvey.selfEval.alignment && 
      this.secondSurvey.selfEval.appropriateness && 
      this.secondSurvey.selfEval.consistency && 
      this.secondSurvey.selfEval.emphasis &&
      this.secondSurvey.selfEval.hierarchy &&
      this.secondSurvey.selfEval.readability
  }

  private isSecondSurveyValid() {
    return this.secondSurvey.time && this.secondSurvey.struggleMost && this.secondSurvey.confidence && this.secondSurvey.effort &&
    this.secondSurvey.implementedParticularlyWell && this.isSelfEvalValid();
  }
}
