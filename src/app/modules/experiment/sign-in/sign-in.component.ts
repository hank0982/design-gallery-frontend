import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { catchError } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services/apis/users/users.service';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  userId?: string;
  error?: string;
  constructor(private storage: StorageMap, private usersService: UsersService) {}

  ngOnInit(): void {
  }

  fetchUserInfo() {
    if (this.userId) {
      this.usersService.fetchById(this.userId).pipe(catchError(error => this.error = 'Please provide valid survey ID')).subscribe(userInfo => {
        this.storage.set('userInfo', userInfo).subscribe();
        this.error = undefined;
      })
    } else {
      this.error = 'ID must not be empty'
    }
  }
}
