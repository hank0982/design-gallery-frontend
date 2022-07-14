import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './pages/projects.component';
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
import { ProjectModalComponent } from './pages/project-modal/project-modal.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MyFavoriteComponent } from './pages/my-favorite/my-favorite.component';
import { ReplayComponent } from '../replay/replay.component';
import { ProjectGalleryComponent } from './pages/project-gallery/project-gallery.component';
import { SavedProjectRowComponent } from './shared/components/saved-project-row/saved-project-row.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: ProjectsComponent, children: [
    { path: 'my-favorite', component: MyFavoriteComponent, children: [
      { path: ':id', component: ProjectModalComponent}
    ]},
    { path: '', component: ProjectGalleryComponent, children: [
      { path: ':id', component: ProjectModalComponent}
    ]},
  ]},
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectPreviewComponent,
    ProjectModalComponent,
    MyFavoriteComponent,
    ProjectGalleryComponent,
    SavedProjectRowComponent,
  ],
  entryComponents: [ProjectPreviewComponent],
  imports: [
    CommonModule,
    MatInputModule,
    InfiniteScrollModule,
    MatFormFieldModule,
    MatExpansionModule,
    ColorTwitterModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatBadgeModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class ProjectsModule { }
