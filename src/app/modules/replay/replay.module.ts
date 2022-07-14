import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReplayComponent } from './replay.component';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReplayPreviewComponent } from '../projects/shared/components/replay-preview/replay-preview.component';



const routes = [
  { path: '', component: ReplayComponent, children: [
    { path: 'userId/:id', children:[
      { path: 'userActivityId/:id', component: ReplayPreviewComponent }
    ]},
  ]}
]

@NgModule({
  declarations: [
    ReplayComponent,
    ReplayPreviewComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ]
  
})


export class ReplayModule { }