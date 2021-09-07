import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { RatingsService } from 'src/app/core/services/apis/ratings/ratings.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IFeedbackUnit } from 'src/app/core/services/models/feedback-unit.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { IRating } from 'src/app/core/services/models/rating.model';
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
  ratings: IRating[][] = [];
  images: Partial<IImage>[] = [];
  project: IProject | undefined;
  feedbackUnits: IFeedbackUnit[] = [];
  subaspectSetValues: string[] = [];
  private calculateAvg(nums: number[]) {
    var sum = 0;
    for( var i = 0; i < nums.length; i++ ){
        sum +=  nums[i]; //don't forget to add the base
    }
    var avg = sum/nums.length;
    return avg;
  }
  getRating(aspect: EDesignAspect | string) {
    switch (aspect) {
      case EDesignAspect.ALIGNMENT:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.ALIGNMENT));
      case EDesignAspect.APPROPRIATENESS:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.APPROPRIATENESS));
      case EDesignAspect.EMPHASIS:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.EMPHASIS));
      case EDesignAspect.CONSISTENCY:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.CONSISTENCY));
      case EDesignAspect.HIERARCHY:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.HIERARCHY));
      case EDesignAspect.READABILITY:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.READABILITY));
      case EDesignAspect.OVERALL:
        return this.calculateAvg(this.ratings[0].map(x => x.rating.OVERALL));
      default:
        break;
    }
    return 0;
  }
  getRevisedRating(aspect: EDesignAspect | string) {
    switch (aspect) {
      case EDesignAspect.ALIGNMENT:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.ALIGNMENT));
      case EDesignAspect.APPROPRIATENESS:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.APPROPRIATENESS));
      case EDesignAspect.EMPHASIS:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.EMPHASIS));
      case EDesignAspect.CONSISTENCY:
        return this.calculateAvg(this.ratings  [1].map(x => x.rating.CONSISTENCY));
      case EDesignAspect.HIERARCHY:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.HIERARCHY));
      case EDesignAspect.READABILITY:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.READABILITY));
      case EDesignAspect.OVERALL:
        return this.calculateAvg(this.ratings[1].map(x => x.rating.OVERALL));
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
    private feedbackUnitsService: FeedbackUnitsService,
    private ratingsService: RatingsService,
  ) { }


  ngOnInit(): void {
    if (this.data.id) {
      this.projectsService.fetchProjectById(this.data.id).pipe(mergeMap(project => {
        this.project = project;
        return forkJoin(this.project!.designIds.map(designId => {
          return this.designsService.fetchDesignById(designId)
        })).pipe(mergeMap(designs => {
          this.designs = designs;
          this.designs.sort((a, b) => a.version - b.version)
          forkJoin(
            this.designs.map(design => {
              return this.ratingsService.fetchRatingByDesignId(design._id)
            })
          ).subscribe(ratings => this.ratings = ratings.map(r => r.results))
          
          this.feedbackUnitsService.fetchFeedbackUnits({designId: designs[0]._id}).subscribe(x => {
            this.feedbackUnits = x;
            this.subaspectSetValues = [...new Set(this.feedbackUnits.map(x => x.subaspect)).values()];
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
