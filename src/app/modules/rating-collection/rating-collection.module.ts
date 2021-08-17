import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RatingCollectionComponent } from './rating-collection.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BootstrapValidationCssDirective } from '../../../shared/directives/bootstrap-validation-css/bootstrap-validation-css.directive';
import { SharedModule } from 'src/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const routes: Routes = [
  { path: ':id', component: RatingCollectionComponent }
];

@NgModule({
  declarations: [
    RatingCollectionComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class RatingCollectionModule { }
