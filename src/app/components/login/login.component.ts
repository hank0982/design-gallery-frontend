import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'src/shared/services/user-data/user-data.service';
import { IUser } from '../../core/services/models/user.model';
import { RecordService } from '../../core/services/record/record.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    private userDataService: UserDataService,
    private recordService: RecordService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  ngOnInit(): void {
    this.userDataService.userInfo.subscribe((data: IUser | undefined) => {
      if (data) {
        this.router.navigate(['gallery'], {relativeTo: this.route})
      }
    })
  }

  fetchUserData(inputEvent: Event) {
    this.userDataService.fetchAndStoreUserInfo((inputEvent.target! as any).value);
  }
  
  replay(): void {
    this.recordService.stopRecording();
  }

}
