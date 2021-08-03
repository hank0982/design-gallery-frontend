import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/apis/users/users.service';

@Component({
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.sass']
})
export class StartPageComponent implements OnInit {
  name?: string;
  error = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
  ) { }

  get raterId() {
    return this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (!this.route.snapshot.paramMap.get('id')) {
      this.router.navigate(['./metadata-collection']);
    } 
  }

  startRating() {
    if (this.name) {
      this.userService.updateName(this.raterId, this.name).subscribe(_x => {
        this.router.navigate([`./metadata-collection/rating-page/${this.route.snapshot.paramMap.get('id')}`])
      });
    } else {
      this.error = true;
    }
  }
}
