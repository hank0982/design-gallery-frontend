import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { IUser } from 'src/app/core/services/models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userInfo: Subject<IUser | undefined>;
  constructor(
    private cookieService: CookieService,
    private usersService: UsersService,
  ) { 
    this.userInfo = new Subject<IUser | undefined>();
    const cookieId = this.cookieService.get('user-id');
    if (cookieId) {
      this.fetchAndStoreUserInfo(cookieId);
    } 
  }

  fetchAndStoreUserInfo(id: string) {
    this.usersService.fetchById(id).subscribe((user: IUser) => {
      if (user) {
        this.cookieService.set('user-id', id);
        this.userInfo.next(user);
      }
    });
  }
}
