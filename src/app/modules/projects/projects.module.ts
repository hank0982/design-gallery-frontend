import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from 'src/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ColorTwitterModule } from 'ngx-color/twitter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectPreviewComponent } from './shared/components/project-preview/project-preview.component';
const routes: Routes = [
  { path: '', component: ProjectsComponent }
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectPreviewComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MatExpansionModule,
    ColorTwitterModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class ProjectsModule { }
