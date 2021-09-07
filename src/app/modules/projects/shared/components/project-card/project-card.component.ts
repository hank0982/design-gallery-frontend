import { Component, Input, OnInit } from '@angular/core';
import { IsBoolean, IsNotEmptyObject, validateSync } from 'class-validator';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectPreviewComponent } from '../project-preview/project-preview.component';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { map } from 'rxjs/operators';
import { IImage } from 'src/app/core/services/models/image.model';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { SavedProjectsService } from '../../services/saved-projects/saved-projects.service';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { IFeedbackUnit } from 'src/app/core/services/models/feedback-unit.model';
import { RatingsService } from 'src/app/core/services/apis/ratings/ratings.service';
import { IRating } from 'src/app/core/services/models/rating.model';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';


@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.sass']
})
export class ProjectCardComponent implements OnInit {
  @Input()
  @IsNotEmptyObject()
  project: IProject | undefined;

  @Input()
  @IsBoolean()
  isSlidingView = false;

  @Input()
  @IsBoolean()
  isSaved = false;

  designs: IDesign[] = [];
  images: Partial<IImage>[] = [];
  showSaveButton = false;
  get imageUrls() {
    return this.images.map(x => `http://${x.thumbnailUrl!}`);
  }
  feedbackUnits: string[] = [];
  ratings: IRating[] = [];
  constructor(
    private designsService: DesignsService,
    private imagesService: ImagesService,
    private savedProjectsService: SavedProjectsService,
    public dialog: MatDialog,
    private ratingsService: RatingsService,
    private feedbackUnitsService: FeedbackUnitsService,
  ) { }

  ngOnInit(): void {
    try { validateSync(this) } catch(e) {throw e}
    forkJoin(this.project!.designIds.map(designId => {
      return this.designsService.fetchDesignById(designId)
    })).subscribe(designs => {
      this.designs = designs;
      this.designs.sort((a, b) => a.version - b.version);
      this.ratingsService.fetchRatingByDesignId(this.designs[0]._id).
        subscribe(ratings => {
          this.ratings = ratings.results;
          const avgRatingDict: {[aspect: string]: number} = {};
          if (this.ratings) {
            avgRatingDict[EDesignAspect.ALIGNMENT] = this.calculateAvg(this.ratings.map(x => x.rating.ALIGNMENT));
            avgRatingDict[EDesignAspect.EMPHASIS] = this.calculateAvg(this.ratings.map(x => x.rating.EMPHASIS));
            avgRatingDict[EDesignAspect.APPROPRIATENESS] = this.calculateAvg(this.ratings.map(x => x.rating.APPROPRIATENESS));
            avgRatingDict[EDesignAspect.HIERARCHY] = this.calculateAvg(this.ratings.map(x => x.rating.HIERARCHY));
            avgRatingDict[EDesignAspect.CONSISTENCY] = this.calculateAvg(this.ratings.map(x => x.rating.CONSISTENCY));
            avgRatingDict[EDesignAspect.READABILITY] = this.calculateAvg(this.ratings.map(x => x.rating.READABILITY));
          }
          this.feedbackUnitsService.fetchFeedbackUnits({designId: designs[0]._id}).subscribe(x => {
            if (avgRatingDict) {
              x.sort((a, b) => avgRatingDict[a.aspect] - avgRatingDict[b.aspect]);
            }
            this.feedbackUnits = [...new Set(x.map(x => x.subaspect).filter(x=>!!x)).values()].slice(0, 3);
          });
        })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      forkJoin(this.designs.map(design => {
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
      })).subscribe(images => {
        this.images = images;
      });
    })


  }

  clickSave(): void {
    if (this.project) {
      if (!this.isSaved) {
        this.savedProjectsService.addNewProject(this.project);
      } else {
        this.savedProjectsService.removeAddedProject(this.project);
      }
    }
    this.isSaved = !this.isSaved;
  }

  openDialog() {
    const dialogRef = this.dialog.open(
      ProjectPreviewComponent, {
        data: {
          project: this.project,
          designs: this.designs,
          images: this.images,
        },
        maxWidth: '90%',
        width: '90%',
        maxHeight: '100%',
        height: '100%',
        backdropClass: 'black-backdrop'  
      }
    );
  }
  private calculateAvg(nums: number[]) {
    var sum = 0;
    for( var i = 0; i < nums.length; i++ ){
        sum +=  nums[i]; //don't forget to add the base
    }
    var avg = sum/nums.length;
    return avg;
  }
}
