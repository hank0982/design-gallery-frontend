import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './navigation-page.component.html',
  styleUrls: ['./navigation-page.component.sass']
})
export class NavigationPageComponent implements OnInit {

  currentStep = 2;
  constructor() { }

  ngOnInit(): void {
  }

}
