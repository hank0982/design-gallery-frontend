import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BootstrapValidationCssDirective } from '../shared/directives/bootstrap-validation-css/bootstrap-validation-css.directive';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './components/login/login.component';
const routes: Routes = [
  { path: '', component: AppComponent, children: [
    { path: '', component: LoginComponent },
    { path: 'gallery', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
    { path: 'metadata-collection', loadChildren: () => import('./modules/metadata-collection/metadata-collection.module').then(m => m.MetadataCollectionModule) },
    { path: 'experiment', loadChildren: () => import('./modules/experiment/experiment.module').then(m => m.ExperimentModule) },
    { path: 'rating-collection', loadChildren: () => import('./modules/rating-collection/rating-collection.module').then(m => m.RatingCollectionModule) },
    { path: 'replay', loadChildren: () => import('./modules/replay/replay.module').then(m => m.ReplayModule) }
  ]},
  
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
    CoreModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' }),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
