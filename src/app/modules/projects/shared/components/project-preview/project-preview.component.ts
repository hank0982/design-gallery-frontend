import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { IProject } from 'src/app/core/services/models/project.model';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.sass']
})
export class ProjectPreviewComponent implements OnInit {
  designAspects = Object.values(EDesignAspect);
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    images: IImage[],
    designs: IDesign[],
    project: IProject
  }) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.data.images && this.data.images.length !== this.data.designs.length) {
      throw new TypeError('The length of imgages array should be equal to the length of designs');
    }
  }
}
