import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentComponent } from './experiment.component';
import { NavigationPageComponent } from './navigation-page/navigation-page.component';
import { DemographyComponent } from './demography/demography.component';
import { PhaseOneComponent } from './phase-one/phase-one.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhaseTwoComponent } from './phase-two/phase-two.component';
import { PhaseThreeComponent } from './phase-three/phase-three.component';
import { LikertInputComponent } from './components/likert-input/likert-input.component';
import { PhaseFourComponent } from './phase-four/phase-four.component';
import { BootstrapValidationCssDirective } from '../../../shared/directives/bootstrap-validation-css/bootstrap-validation-css.directive';
import { SignInComponent } from './sign-in/sign-in.component';
import { SharedModule } from 'src/shared/shared.module';


const routes: Routes = [
  { path: '', component: ExperimentComponent, children: [
    { path: 'demography', component: DemographyComponent },
    { path: 'navigation', component: NavigationPageComponent },
    { path: 'phase-one', component: PhaseOneComponent }, 
    { path: 'phase-two', component: PhaseTwoComponent }, 
    { path: 'phase-three', component: PhaseThreeComponent }, 
    { path: 'phase-four', component: PhaseFourComponent }, 
    { path: 'sign-in', component: SignInComponent }, 
  ] 
},
];

@NgModule({
  declarations: [
    ExperimentComponent,
    NavigationPageComponent,
    DemographyComponent,
    LikertInputComponent,
    PhaseOneComponent,
    PhaseTwoComponent,
    PhaseThreeComponent,
    PhaseFourComponent,
    SignInComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [ExperimentComponent]
})
export class ExperimentModule { }
