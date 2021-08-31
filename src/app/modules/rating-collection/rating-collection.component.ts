import { Component, OnInit } from '@angular/core';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { IRatedProject, ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { IProject } from 'src/app/core/services/models/project.model';
import { IUser } from 'src/app/core/services/models/user.model';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { concatMap, first, map } from 'rxjs/operators';
import { concat, forkJoin, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingsService } from 'src/app/core/services/apis/ratings/ratings.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IRating } from 'src/app/core/services/models/rating.model';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { IFeedbackUnit } from 'src/app/core/services/models/feedback-unit.model';

@Component({
  selector: 'app-rating-collection',
  templateUrl: './rating-collection.component.html',
  styleUrls: ['./rating-collection.component.sass']
})
export class RatingCollectionComponent implements OnInit {
  currentIndex = 0;
  projects?: IProject[];
  ratedProjects?: IRatedProject;
  currentDesigns?: IDesign[];
  currentImages?: Partial<IImage>[];
  userMetadata?: IUser;

  currentForm?: FormGroup;
  isFirstImageLoading = false;
  isSecondImageLoading = false;
  isResultBeingSubmitted = false;
  isRatingIsLoading = false;

  feedbackUnits?: IFeedbackUnit[];
  feedbackVisibleDict = {
    [EDesignAspect.ALIGNMENT]: false,
    [EDesignAspect.APPROPRIATENESS]: false,
    [EDesignAspect.CONSISTENCY]: false,
    [EDesignAspect.EMPHASIS]: false,
    [EDesignAspect.READABILITY]: false,
    [EDesignAspect.HIERARCHY]: false,
    [EDesignAspect.OVERALL]: false

  };

  appropriateSubaspects = [
    'Misleading concept',
    'Improper color theme',
    'Confusing visual element',
    'Unclear message',
    'Not visually enticing',
    'Inappropriate text phrasing',
    'Copyright permission',
    'Missing key info',
    'Unclear audience',
    'Irrelevant elements'
  ]

  emphasisSubaspects = [
    'Weak info highlighting',
    'Weak point of entry',
    'Poor color contrast',
    'Competing focal points',
    'Lacks visual weight'
  ]

  hierarchySubaspects = [
    'Lacks typographic hierarchy',
    'Unclear visual flow',
    'Poor element arrangement',
    'Poor content proportion'
  ]

  consistencySubaspects = [
    'Incohesive font choices',
    'Incohesive visual elements',
    'Too many fonts',
    'Incohesive color choices',
    'Incohesive visual elements',
    'Lacks color variety',
    'Too many colors'
  ]

  readabilitySubaspects = [
    'Low contrast between text and background',
    'Poor image editing',
    'Improper letter spacing',
    'Distracting font effects',
    'Wordy sentences',
    'Difficult to read font',
    'Font too small',
    'Poor image quality',
    'Awkward sentence break',
    'Improper font stretching',
    'Improper line spacing'
  ]

  alignmentSubaspects = [
    'Poor white space usage',
    'Improper image text overlay',
    'Lacks content alignment',
    'Uneven margin',
    'Odd image cutoff',
    'Too close to the border',
    'Inconsistent text alignment',
    'Improper text alignment',
    'Inconsistent element alignment',
    'Awkward element alignment'
  ]
  get raterId() {
    const raterId = this.route.snapshot.paramMap.get('id');
    return raterId;
  }

  get hasFeedbackForAppropriateness() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.APPROPRIATENESS)?.length >= 1;
    } else {
      return false;
    }
  }

  get hasFeedbackForEmphasis() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.EMPHASIS)?.length >= 1;
    } else {
      return false;
    }
  } 
  
  get hasFeedbackForAlignment() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.ALIGNMENT)?.length >= 1;
    } else {
      return false;
    }
  } 
  
  get hasFeedbackForConsistency() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.CONSISTENCY)?.length >= 1;
    } else {
      return false;
    }
  }

  get hasFeedbackForHierarchy() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.HIERARCHY)?.length >= 1;
    } else {
      return false;
    }
  }

  get hasFeedbackForReadability() {
    if (this.feedbackUnits) {
      return this.feedbackUnits.filter(x => x.aspect === EDesignAspect.READABILITY)?.length >= 1;
    } else {
      return false;
    }
  }

  constructor(
    private projectsService: ProjectsService,
    private imagesService: ImagesService,
    private route: ActivatedRoute,
    private designsService: DesignsService,
    private ratingsService: RatingsService,
    private feedbackUnitsService: FeedbackUnitsService,
    private usersService: UsersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.projectsService.fetchAllProjects(0, 0).subscribe(
      projects => {
        this.projects = projects.results;
        this.refetchNewDesigns();
      }
    )
    this.updateRatedProjects();
  }

  changeIndex(newIndex: number) {
    this.currentIndex = newIndex;
    this.refetchNewDesigns();
  }

  submitResults() {
    this.currentForm?.markAllAsTouched();
    if (this.currentDesigns && this.raterId && this.currentForm?.valid) {
      this.isResultBeingSubmitted = true;
      forkJoin(
        [this.uploadDesignResult(true), this.uploadDesignResult(false)]
      ).subscribe((x) => {
        this.isResultBeingSubmitted = false;
      });
    }
  }

  handleCheckbox(designIndex: number, value: number, aspect: EDesignAspect | string) {
    if (this.currentDesigns && this.raterId) {
      this.ratingsService.createOrUpdateRating({
        designId: this.currentDesigns[designIndex]._id,
        aspect: aspect as EDesignAspect,
        raterId: this.raterId,
        rating: value,
      }).subscribe();
    }
  }

  uploadDesignResult(isFirst: boolean) {
    const index = isFirst ? 0 : 1;
    const designForm = isFirst ? 'firstDesign' : 'secondDesign';
    if (this.currentDesigns && this.raterId && this.currentForm?.valid) {
      return this.ratingsService.createOrUpdateRating({
          designId: this.currentDesigns[index]._id,
          aspect: EDesignAspect.ALIGNMENT,
          raterId: this.raterId,
          rating: Number(this.currentForm?.get(designForm)?.get('alignment')!.value),
        }).pipe(
          concatMap(() => this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.APPROPRIATENESS,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('appropriateness')!.value),
          })),
          concatMap(() =>  this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.HIERARCHY,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('hierarchy')!.value),
          })),
          concatMap(() => this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.READABILITY,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('readability')!.value),
          })),
          concatMap(() => this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.CONSISTENCY,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('consistency')!.value),
          })),
          concatMap(() => this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.EMPHASIS,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('emphasis')!.value),
          })),
          concatMap(() => this.ratingsService.createOrUpdateRating({
            designId: this.currentDesigns![index]._id,
            aspect: EDesignAspect.OVERALL,
            raterId: this.raterId!,
            rating: Number(this.currentForm?.get(designForm)?.get('overall')!.value),
          }))
        );
    } else {
      return of(undefined);
    }
  }

  toggleFeedbackVisiblity(aspect: EDesignAspect | string) {
    (this.feedbackVisibleDict as any)[aspect] = !(this.feedbackVisibleDict as any)[aspect];
  }

  private updateCurrentFormWithPreviousRatings(rating: IRating, isFirst: boolean) {
    const designForm = isFirst ? 'firstDesign' : 'secondDesign';
    this.currentForm?.get(designForm)?.get('alignment')!.setValue(rating.rating.ALIGNMENT)
    this.currentForm?.get(designForm)?.get('emphasis')!.setValue(rating.rating.EMPHASIS)
    this.currentForm?.get(designForm)?.get('appropriateness')!.setValue(rating.rating.APPROPRIATENESS)
    this.currentForm?.get(designForm)?.get('consistency')!.setValue(rating.rating.CONSISTENCY)
    this.currentForm?.get(designForm)?.get('hierarchy')!.setValue(rating.rating.HIERARCHY)
    this.currentForm?.get(designForm)?.get('readability')!.setValue(rating.rating.READABILITY)
    this.currentForm?.get(designForm)?.get('overall')!.setValue(rating.rating.OVERALL)
  }

  private updateRatedProjects() {
    if (this.raterId) {
      this.usersService.ratedProjects(this.raterId).subscribe(ratedProject => {
        this.ratedProjects = ratedProject;
      });
    }
  }

  getFeedbackUnitsForAspect(aspect: EDesignAspect | string): IFeedbackUnit[] | undefined {
    return this.feedbackUnits?.filter(x => x.aspect === aspect);
  }

  handleSelectChange(index: number, event: Event) {
    if (this.feedbackUnits && this.feedbackUnits[index]) {
      this.feedbackUnits[index].aspect = (event as any).target.value;
      this.feedbackUnitsService.updateFeedbackUnit(this.feedbackUnits[index]._id, {
        aspect: this.feedbackUnits[index].aspect
      }).subscribe();
      this.feedbackUnits = [...this.feedbackUnits];
    }
  }
  handleSubaspectSelectChange(index: number, event: Event) {
    if (this.feedbackUnits && this.feedbackUnits[index]) {
      this.feedbackUnits[index].subaspect = (event as any).target.value;
      this.feedbackUnitsService.updateFeedbackUnit(this.feedbackUnits[index]._id, {
        subaspect: this.feedbackUnits[index].subaspect
      }).subscribe();
      this.feedbackUnits = [...this.feedbackUnits];
    }
  }
  private refetchNewDesigns() {
    this.currentForm = this.fb.group({
      firstDesign: this.fb.group({
        emphasis: [undefined, Validators.required],
        appropriateness: [undefined, Validators.required],
        hierarchy: [undefined, Validators.required],
        readability: [undefined, Validators.required],
        consistency: [undefined, Validators.required],
        alignment: [undefined, Validators.required],
        overall: [undefined, Validators.required],
      }),
      secondDesign: this.fb.group({
        emphasis: [undefined, Validators.required],
        appropriateness: [undefined, Validators.required],
        hierarchy: [undefined, Validators.required],
        readability: [undefined, Validators.required],
        consistency: [undefined, Validators.required],
        alignment: [undefined, Validators.required],
        overall: [undefined, Validators.required],        
      })
    });
    this.isFirstImageLoading = true;
    this.isSecondImageLoading = true;
    this.isRatingIsLoading = true;
    this.currentDesigns = [];
    this.updateRatedProjects();
    if (this.projects && this.raterId){
      forkJoin(this.projects[this.currentIndex].designIds.map(designId => {
        return this.designsService.fetchDesignById(designId)
      })).pipe(first()).subscribe(designs => {
        this.currentDesigns = designs;
        this.currentDesigns.sort((a, b) => a.version - b.version)
        if (this.raterId) {
          forkJoin(
            [
              this.ratingsService.fetchRatingByRaterIdAndDesignId(this.raterId, this.currentDesigns?.[0]._id),
              this.ratingsService.fetchRatingByRaterIdAndDesignId(this.raterId, this.currentDesigns?.[1]._id),
              this.feedbackUnitsService.fetchFeedbackUnits({designId: this.currentDesigns?.[0]._id}),
            ]
          ).subscribe(([ratingOne, ratingTwo, feedbackOne]) => {
            if (ratingOne.results.length > 0) {
              this.updateCurrentFormWithPreviousRatings(ratingOne.results[0], true);
            }
            if (ratingTwo.results.length > 0) {
              this.updateCurrentFormWithPreviousRatings(ratingTwo.results[0], false);
            }
            this.feedbackUnits = feedbackOne;
            this.isRatingIsLoading = false;
          });
        }
        forkJoin(this.currentDesigns.map(design => {
          if (design.imageUrl) {
            return of(
              {
                url: design.imageUrl
              });
          } else if (design.imageId) {
            return this.imagesService.fetchImageById(design.imageId).pipe(map(x => {
              return {...x, url: `http://${x.url}`}
            }));
          }
          return of({});
        })).subscribe(images => {
          this.currentImages = images;
        })
      });
    }
  }
}

