import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { IUser } from 'src/app/core/services/models/user.model';
import { PhaseStepService } from './services/phase-step/phase-step.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.sass']
})
export class ExperimentComponent implements OnInit, OnDestroy {

  constructor(
    private phaseStepService: PhaseStepService,
    ) { }

  ngOnDestroy(): void {
    this.phaseStepService.cancelSubscriptionOfUserInfo();
  }

  ngOnInit(): void {
    this.phaseStepService.watchLocalStorageAndRedirect();
  }

}
