import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComparisonComponent } from './components/image-comparison/image-comparison.component';
import { BootstrapValidationCssDirective } from './directives/bootstrap-validation-css/bootstrap-validation-css.directive';
import { UserDataService } from './services/user-data/user-data.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  providers: [CookieService],
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
