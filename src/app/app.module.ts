import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BootstrapValidationCssDirective } from '../shared/directives/bootstrap-validation-css/bootstrap-validation-css.directive';

const routes: Routes = [
  { path: 'gallery', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'metadata-collection', loadChildren: () => import('./modules/metadata-collection/metadata-collection.module').then(m => m.MetadataCollectionModule) },
  { path: 'experiment', loadChildren: () => import('./modules/experiment/experiment.module').then(m => m.ExperimentModule) },
  { path: 'rating-collection', loadChildren: () => import('./modules/rating-collection/rating-collection.module').then(m => m.RatingCollectionModule) }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
