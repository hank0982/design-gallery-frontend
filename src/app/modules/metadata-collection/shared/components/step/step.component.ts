import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.sass']
})
export class StepComponent implements OnInit {
  
  ratings = [1, 2, 3, 4, 5];
  
  @Input()
  disabled: boolean = false;

  @Input()
  beforeEditable: number | undefined;

  @Input()
  isOnlyRating: boolean = false;

  @Input()
  isOnlyFeedback: boolean = false;

  @Input()
  form!: FormGroup;

  @Input()
  currentPrinciple!: EDesignAspect;

  @Output()
  clickNext = new EventEmitter<Event>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onNextClick(event: Event) {
    if (this.form.invalid) {
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      this._snackBar.open('Please fill all the information in the form', undefined, {duration: 3000})
    } else {
      this.clickNext.next(event);
    }
  }

  generateSubprinciplePrefix(rating: number) {
    return rating <= 2 ? 'Violate' : 'Follow';
  }

  createNewFeedbackUnit() {
    (this.form.get('feedbackForms') as FormArray).push(
      this._formBuilder.group({
        subprinciple: new FormControl({
          value: undefined, 
          disabled: this.disabled
        }, [Validators.required]),
        feedback: new FormControl({
          value: undefined, 
          disabled: this.disabled
        }, [Validators.required]),
      })
    )
  }

  removeFeedbackUnit(index: number) {
    (this.form.get('feedbackForms') as FormArray).removeAt(index);
  }
}
