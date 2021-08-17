import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { RateToTextService } from 'src/app/core/services/rate-to-text/rate-to-text.service';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.sass']
})
export class ProjectPreviewComponent implements OnInit {
  designPrinciples = [...Object.values(EDesignAspect).filter(x => x!==EDesignAspect.OVERALL), EDesignAspect.OVERALL];
  tagSet: Set<string> = new Set([]);

  designs: IDesign[] = [];
  images: Partial<IImage>[] = [];
  project: IProject | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    id?: string;
  },
    private rateToTextService: RateToTextService,
    private designsService: DesignsService,
    private imagesService: ImagesService,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    if (this.data.id) {
      this.projectsService.fetchProjectById(this.data.id).pipe(mergeMap(project => {
        this.project = project;
        return forkJoin(this.project!.designIds.map(designId => {
          return this.designsService.fetchDesignById(designId)
        })).pipe(mergeMap(designs => {
          this.designs = designs;
          return forkJoin(this.designs.map(design => {
            if (design.imageUrl) {
              return of(
                {
                  url: design.imageUrl
                });
            } else if (design.imageId) {
              return this.imagesService.fetchImageById(design.imageId).pipe(map(x => {
                return {...x, url: `http://${x.url}`}
              }))
            }
            return of({})
          })).pipe(tap(images => {
            this.images = images;
            this.generateTagSet();
          }));
        }));
      })).subscribe();
     
    }
  }

  generateTagSet() {
    this.designs.forEach((design, index) => {
      this.tagSet.add(`Text Proportion: ${this.rateToTextService.parseTextProportion(design.textProportion)}`);
      this.tagSet.add(`Text Quantity: ${this.rateToTextService.parseTextQuantity(design.textQuantity)}`);
      this.tagSet.add(`Image Usage: ${this.rateToTextService.parseImageUsageEnumToText(design.imageUsage)}`);
    });
  }

  ngOnChanges(): void {
    if (this.images && this.images.length !== this.designs.length) {
      throw new TypeError('The length of imgages array should be equal to the length of designs');
    }
  }
}
