import { Component, forwardRef, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-likert-input',
  templateUrl: './likert-input.component.html',
  styleUrls: ['./likert-input.component.sass'],

})
export class LikertInputComponent implements OnInit, ControlValueAccessor {
  @Input()
  name!: string;

  @Input()
  minimumLabel?: string;
  
  @Input()
  maximumLabel?: string;

  currentValue?: number;


  onChange = (currentValue: number) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  constructor(public control:NgControl){
    if (this.control != null) {
      this.control.valueAccessor = this;
    }
  }

  writeValue(currentValue: number): void {
    this.currentValue = currentValue;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  ngOnInit(): void {
    if (!this.name) {
      console.error('Please provide valid name for likert input component');
    }
  }

}
