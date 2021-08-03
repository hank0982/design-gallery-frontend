import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { ISurveyInfo } from 'src/app/core/services/models/user.model';
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
    private phaseStepService: PhaseStepService
  ) { }

  ngOnInit(): void {
  }

  onFileChange(event: Event) {
    this.fileData = (event.target! as any).files[0];
    console.log(this.fileData)
  }

  submitSecondSurvey() {
    console.log(this.secondSurvey)
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
}
