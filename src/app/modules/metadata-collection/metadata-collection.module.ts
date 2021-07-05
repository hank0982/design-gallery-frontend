import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MetadataCollectionComponent } from './metadata-collection.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: NotFoundComponent },
  { path: ':id', component: MetadataCollectionComponent }
];

@NgModule({
  declarations: [
    NotFoundComponent,
    MetadataCollectionComponent
  ],
  imports: [
    FormsModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MetadataCollectionModule { }
