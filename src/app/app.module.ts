import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotFoundComponent } from './modules/shared/not-found/not-found.component';
const routes: Routes = [
  { path: 'gallery', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'metadata-collection', loadChildren: () => import('./modules/metadata-collection/metadata-collection.module').then(m => m.MetadataCollectionModule) }
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
