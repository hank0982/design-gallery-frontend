import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComparisonComponent } from './components/image-comparison/image-comparison.component';
import { BootstrapValidationCssDirective } from './directives/bootstrap-validation-css/bootstrap-validation-css.directive';



@NgModule({
  declarations: [
    ImageComparisonComponent,
    BootstrapValidationCssDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ImageComparisonComponent, BootstrapValidationCssDirective]
})
export class SharedModule { }
