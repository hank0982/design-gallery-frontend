import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogContent, MAT_DIALOG_DATA } from "@angular/material/dialog";



@Component({
  templateUrl: './replay-preview.component.html',
  styleUrls: ['replay-preview.component.sass']
})

export class ReplayPreviewComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string}) {}

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }
  
}