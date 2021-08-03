import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './phase-three.component.html',
  styleUrls: ['./phase-three.component.sass']
})
export class PhaseThreeComponent implements OnInit {
  step: number = 0;
  isReflection = true;
  constructor() { }

  ngOnInit(): void {
  }

}
