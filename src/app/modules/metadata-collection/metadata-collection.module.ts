import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MetadataCollectionComponent } from './metadata-collection.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackUnitCollectorComponent } from './shared/components/feedback-unit-collector/feedback-unit-collector.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatExpansionModule } from '@angular/material/expansion';
import { StepComponent } from './shared/components/step/step.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StartPageComponent } from './pages/start-page/start-page.component';

const routes: Routes = [
  { path: '', component: NotFoundComponent },
  { path: 'start-page/:id', component: StartPageComponent },
  { path: 'rating-page/:id', component: MetadataCollectionComponent }
];

@NgModule({
  declarations: [
    NotFoundComponent,
    MetadataCollectionComponent,
    FeedbackUnitCollectorComponent,
    StepComponent,
    StartPageComponent
  ],
  imports: [
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatCardModule,
    RouterModule.forChild(routes)
  ]
})
export class MetadataCollectionModule { }
