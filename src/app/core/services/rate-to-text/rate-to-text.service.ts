import { Injectable } from '@angular/core';
import { EDesignImageUsages } from '../models/design.model';

@Injectable({
  providedIn: 'root'
})
export class RateToTextService {
  readonly textProportion = ['Plenty', 'Moderate', 'Minimal', 'None'];
  readonly textQuantity = ['Plenty', 'Moderate', 'Minimal', 'None'];
  constructor() { }

  parseTextQuantity(textQuantityNumber: number) {
    return this.textQuantity[this.textQuantity.length - textQuantityNumber];
  }

  parseTextProportion(textProportionNumber: number) {
    return this.textProportion[this.textProportion.length - textProportionNumber];
  }

  parseImageUsageEnumToText(imageUsage: EDesignImageUsages) {
    switch (imageUsage) {
      case EDesignImageUsages.BOTH:
        return 'Both illustration and photo';
      case EDesignImageUsages.ILLUSTRATION:
        return 'Illustration';
      case EDesignImageUsages.NONE:
        return 'None';
      case EDesignImageUsages.PHOTO:
        return 'Photo';
    }
  }
}
