import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import SUBPRINCIPLE from 'src/app/constants/subprinciple-content.constant';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { MetadataCollectionTopicService } from '../../services/metadata-collection-topic/metadata-collection-topic.service';

@Component({
  selector: 'app-feedback-unit-collector',
  templateUrl: './feedback-unit-collector.component.html',
  styleUrls: ['./feedback-unit-collector.component.sass']
})
export class FeedbackUnitCollectorComponent implements OnInit {
  subprinciples = [
    'Placement',
    'Margins',
    'Gutters',
  ];
  customizedSubprinciple = '';
  explanation = SUBPRINCIPLE;
  @Input()
  currentPrinciple!: EDesignAspect;

  @Input()
  removable: boolean = false;

  @Input()
  currentIndex: number = 1;

  @Input()
  disabled: boolean = false;

  @Input()
  form!: FormGroup;

  @Input()
  rating!: number;

  @Output()
  clickRemoveButton = new EventEmitter();

  @Input()
  isOpen = true;
  constructor(
    private metadataCollectionTopicService: MetadataCollectionTopicService,
    private _snackBar: MatSnackBar
  ) {}

  clickRemove() {
    if (this.removable) {
      this.clickRemoveButton.next();
    } else {
      this._snackBar.open('You should at least provide a feedback explanation', undefined, {duration: 3000});
    }
  }

  async addNewTopic(newTopic: string) {
    if (newTopic) {
      this.form.get('subprinciple')?.setValue(newTopic);
      await this.metadataCollectionTopicService.addNewTopic(newTopic).toPromise();
    }
  }

  countWords(str: string): number {
    return (str?.match(/\S+/g) || []).length;
  }

  ngOnInit(): void {
    this.metadataCollectionTopicService.subprinciplesBS.subscribe(s => this.subprinciples = s);
  }
}
