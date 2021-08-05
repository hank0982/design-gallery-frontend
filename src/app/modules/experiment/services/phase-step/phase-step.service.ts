import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { ISurveyInfo, IUser } from 'src/app/core/services/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PhaseStepService {

  currentPhase = 0;
  currentStep = 0;
  currentUser?: IUser = undefined;
  userInfoSubscription?: Subscription;

  currentUserBS = new BehaviorSubject<IUser | undefined>(undefined);
  constructor(
    private router: Router,
    private storage: StorageMap,
    private usersService: UsersService,
  ) { }

  private updateCurrentUser(newUser: undefined | IUser) {
    this.currentUser = newUser;
    this.currentUserBS.next(this.currentUser);
  }

  proceedOneMorePhase() {
    this.storage.get('userInfo').subscribe((x) => {
      const user = x as IUser;
      if (!user) {
        this.router.navigate(['/', 'demography']);
      }
      if (user.surveyInfo) {
        user.surveyInfo.currentPhase = user.surveyInfo.currentPhase + 1;
        user.surveyInfo.currentStep = 0;
        this.usersService.updateSurveyInfo(user._id, user.surveyInfo!).subscribe();
      }
      this.updateCurrentUser(user);
      this.storage.set('userInfo', this.currentUser).subscribe();
    });
  }

  proceedOneMoreStep() {
    this.storage.get('userInfo').subscribe((x) => {
      const user = x as IUser;
      if (!user) {
        this.router.navigate(['/', 'demography']);
      }
      if (user.surveyInfo) {
        user.surveyInfo.currentStep = user.surveyInfo.currentStep + 1;
        this.usersService.updateSurveyInfo(user._id, user.surveyInfo!).subscribe();
      }
      this.updateCurrentUser(user);
      this.storage.set('userInfo', user).subscribe();
    });
  }

  updateSurveyInfo(newSurveyInfo: ISurveyInfo) {
    this.currentUser!.surveyInfo = newSurveyInfo;
    this.updateCurrentUser(this.currentUser);
    this.storage.set('userInfo', this.currentUser).subscribe();
  }

  watchLocalStorageAndRedirect() {
    this.storage.get('userInfo').subscribe(x => {
      const user = x as IUser;
      if (x) {
        this.usersService.fetchById(user._id).subscribe(userInfo => {
          this.updateCurrentUser(user);
          this.storage.set('userInfo', userInfo).subscribe();
        })
      }
    });
    this.userInfoSubscription = this.storage.watch('userInfo').subscribe((x) => {
      const user = x as IUser;
      if (!user) {
        this.router.navigate(['/experiment/demography']);
      }

      if (user?.surveyInfo) {
        this.updateCurrentUser(user);
        this.currentStep = user.surveyInfo.currentStep;
        this.currentPhase = user.surveyInfo.currentPhase;
      }

      switch (user?.surveyInfo?.currentPhase) {
        case 1:
          this.router.navigate(['/experiment/phase-one']);
          break;
        case 2:
          this.router.navigate(['/experiment/phase-two']);
          break;
        case 3:
          this.router.navigate(['/experiment/phase-three']);
          break;
        case 4:
          this.router.navigate(['/experiment/phase-four']);
          break;
        default:
          break;
      }
    })
  }

  cancelSubscriptionOfUserInfo() {
    this.userInfoSubscription?.unsubscribe()
  }
}
