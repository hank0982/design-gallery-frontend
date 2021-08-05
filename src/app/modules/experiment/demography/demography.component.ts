import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { UsersService } from 'src/app/core/services/apis/users/users.service';

@Component({
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.sass']
})
export class DemographyComponent implements OnInit {

  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private storage: StorageMap,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        checkConsentForm: [false, Validators.requiredTrue],
        name: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        gender: [undefined, Validators.required],
        age: [undefined, Validators.required],
        levelOfExpertise: [undefined, Validators.required],
        designEducationBackground: [undefined, Validators.required],
        yearsOfProfessionalExperience: [undefined, Validators.required],
        infoSource: [''],
      }
    )
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.userService.registerSurveyUser(
        {
          name: this.form.get('name')?.value,
          password: 'NONE',
          username: this.form.get('email')?.value,
          surveyInfo: {
            gender: this.form.get('gender')?.value,
            age: this.form.get('age')?.value,
            currentPhase: 1,
            currentStep: 0,
            email: this.form.get('email')?.value,
            levelOfExpertise: this.form.get('levelOfExpertise')?.value,
            designEducationBackground: this.form.get('designEducationBackground')?.value,
            yearsOfProfessionalExperience: this.form.get('yearsOfProfessionalExperience')?.value,
          }
        }
      ).subscribe(user => this.storage.set('userInfo', user).subscribe());
    }
  }


}
