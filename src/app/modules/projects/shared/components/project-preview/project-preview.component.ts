import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IFeedbackUnit } from 'src/app/core/services/models/feedback-unit.model';
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
  feedbackUnits: IFeedbackUnit[] = [];

  getRating(aspect: EDesignAspect | string) {
    switch (aspect) {
      case EDesignAspect.ALIGNMENT:
        return 5
      case EDesignAspect.APPROPRIATENESS:
        return 5
      case EDesignAspect.EMPHASIS:
        return 4
      case EDesignAspect.CONSISTENCY:
        return 4
      case EDesignAspect.HIERARCHY:
        return 3
      case EDesignAspect.READABILITY:
        return 4
      case EDesignAspect.OVERALL:
        return 4
      default:
        break;
    }
    return 0;
  }
  getRevisedRating(aspect: EDesignAspect | string) {
    switch (aspect) {
      case EDesignAspect.ALIGNMENT:
        return 6
      case EDesignAspect.APPROPRIATENESS:
        return 5
      case EDesignAspect.EMPHASIS:
        return 6
      case EDesignAspect.CONSISTENCY:
        return 5
      case EDesignAspect.HIERARCHY:
        return 4
      case EDesignAspect.READABILITY:
        return 5
      case EDesignAspect.OVERALL:
        return 5
      default:
        break;
    }
    return 0;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    id?: string;
  },
    private rateToTextService: RateToTextService,
    private designsService: DesignsService,
    private imagesService: ImagesService,
    private projectsService: ProjectsService,
    private feedbackUnitsService: FeedbackUnitsService
  ) { }

  ngOnInit(): void {
    if (this.data.id) {
      this.projectsService.fetchProjectById(this.data.id).pipe(mergeMap(project => {
        this.project = project;
        return forkJoin(this.project!.designIds.map(designId => {
          return this.designsService.fetchDesignById(designId)
        })).pipe(mergeMap(designs => {
          this.designs = designs;
          this.feedbackUnitsService.fetchFeedbackUnits({designId: designs[0]._id}).subscribe(x => {
            this.feedbackUnits = x;
          });
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

  hasFeedbackForAspect(aspect: EDesignAspect) {
    return this.feedbackUnits.filter(x => x.aspect === aspect).length === 0
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
