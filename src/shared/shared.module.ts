import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComparisonComponent } from './components/image-comparison/image-comparison.component';



@NgModule({
  declarations: [
    ImageComparisonComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [ImageComparisonComponent]
})
export class SharedModule { }
