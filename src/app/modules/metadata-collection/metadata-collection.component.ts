import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { promises } from 'dns';
import { forkJoin, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { FeedbackUnitsService } from 'src/app/core/services/apis/feedback-units/feedback-units.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { IFeedbackAndRatings, IRatedProject, ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { RatingsService } from 'src/app/core/services/apis/ratings/ratings.service';
import { UsersService } from 'src/app/core/services/apis/users/users.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { CreateRatingDto } from 'src/app/core/services/models/rating.model';
import { MetadataCollectionTopicService } from './shared/services/metadata-collection-topic/metadata-collection-topic.service';

@Component({
  selector: 'app-metadata-collection',
  templateUrl: './metadata-collection.component.html',
  styleUrls: ['./metadata-collection.component.sass'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class MetadataCollectionComponent implements OnInit {
  projects: IProject[] | undefined;
  currentIndex = 0;
  currentDesigns: IDesign[] | undefined;
  currentImages: Partial<IImage>[] | undefined;
  currentPrinciple = EDesignAspect.EMPHASIS;

  ratings = [1,2,3,4];
  designPrinciples = [Object.values(EDesignAspect)[0]];

  userMetadata: IUserMetadata | undefined;
  firstDesignForm!: FormGroup | undefined;
  secondDesignForm!: FormGroup;
  thirdDesignForm!: FormGroup;
  finalDesignForm!: FormGroup;
  currentStep = 1;

  firstImageLoading: boolean = true;
  secondImageLoading: boolean = true;

  firstFormBeforeIndexEditable: number | undefined;

  currentImageSrc = '';
  isModalOpen = false;

  get raterId() {
    const raterId = this.route.snapshot.paramMap.get('id');
    return raterId;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignsService,
    private metadataCollectionTopicService: MetadataCollectionTopicService,
    private ratingService: RatingsService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private imagesService: ImagesService,
    private feedbackUnitsService: FeedbackUnitsService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fetchRaterMetadata();
    this.projectsService.fetchAllProjects(0, 0).pipe(first()).subscribe(projects => {
      this.projects = projects.results;
      this.refetchNewDesigns();
    });    
  }

  onFirstImageLoad() {
    this.firstImageLoading = false;
  }

  onSecondImageLoad() {
    this.secondImageLoading = false;
  }

  clickImage(src?: string) {
    if (src) {
      window.open(src, "_blank");
    }
  }
  private fetchRaterMetadata() {
    this.metadataCollectionTopicService.initCurrentPrinciple(this.currentPrinciple)
      .subscribe(() => {
        if (this.raterId) {
          forkJoin({
            userInfo: this.usersService.fetchById(this.raterId),
            ratedProjects: this.projectsService.fetchRatedProjects(this.currentPrinciple)
          }).pipe(
            first(),
            catchError(e => {
              console.log(e);
              this.router.navigate(['./metadata-collection/']);
              throw new Error(e);
            })
          ).subscribe(x => {
            this.userMetadata = x;
          });
        }
      }); 
  }

  async onNextClick() {
    if (this.firstDesignForm) {
      this.currentStep ++;
      if (this.currentStep === 3) {
        this.firstFormBeforeIndexEditable = (this.firstDesignForm.get('feedbackForms') as FormArray).controls.length;
      }
      if (this.currentStep === 5) {
        await this.sendRequest();
        this.clearForm();
        this.changeCurrentIndex(this.currentIndex + 1);
      }
    }
  }

  private clearForm() {
    this.firstDesignForm = undefined;
    this.secondDesignForm.reset();
    this.thirdDesignForm.reset();
  }

  private async sendRequest() {
    if (this.firstDesignForm) {
      await this.ratingService.createOrUpdateRating({
        designId: this.currentDesigns![0]._id,
        raterId: this.raterId!,
        aspect: this.currentPrinciple,
        rating: Number(this.firstDesignForm.get('rating')!.value)
      }).toPromise();
  
      await this.ratingService.createOrUpdateRating({
        designId: this.currentDesigns![1]._id,
        raterId: this.raterId!,
        aspect: this.currentPrinciple,
        rating: Number(this.secondDesignForm.get('rating')!.value)
      }).toPromise();
  
      await Promise.all((this.firstDesignForm.get('feedbackForms') as FormArray).controls.map((control, index) => {
        return this.feedbackUnitsService.createFeedbackUnit({
          designId: this.currentDesigns![0]._id,
          feedbackProviderId: this.raterId!,
          content: control.get('feedback')!.value,
          aspect: this.currentPrinciple,
          isPositive: Number(this.firstDesignForm!.get('rating')!.value) >= 3,
          addressed: (this.thirdDesignForm.get('addressed') as FormArray)!.controls[index].value,
          subaspect: control.get('subprinciple')!.value,
        }).toPromise();
      })) 
    }
  }

  private fetchOldRatingsAndFeedback() {
    this.projectsService.fetchFeedbackAndRatings(this.projects![this.currentIndex]._id, this.currentPrinciple).subscribe(
      result => {
        if (result) {
          this.initializeForm(result);
        } else {
          this.initializeForm();
        }
      }
    );
  }

  changeCurrentIndex(index: number) {
    this.currentIndex = index;
    this.currentStep = 1;
    this.currentDesigns = undefined;
    this.firstFormBeforeIndexEditable = undefined;
    this.refetchNewDesigns();
    this.fetchRaterMetadata();
  }

  private refetchNewDesigns() {
    this.firstImageLoading = true;
    this.secondImageLoading = true;
    this.currentDesigns = [];
    this.firstDesignForm = undefined;
    if (this.projects && this.raterId){
      forkJoin(this.projects[this.currentIndex].designIds.map(designId => {
        return this.designService.fetchDesignById(designId)
      })).pipe(first()).subscribe(designs => {
        this.currentDesigns = designs;
        this.fetchOldRatingsAndFeedback();
        forkJoin(this.currentDesigns.map(design => {
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
        })).subscribe(images => this.currentImages = images)
        
      });
    }
  }

  private initializeForm(result?: IFeedbackAndRatings) {
    this.firstDesignForm = undefined;
    if (!result || result.ratings.length === 0) {
      this.firstDesignForm = this._formBuilder.group({
        rating: [undefined, [Validators.required]],
        feedbackForms: this._formBuilder.array(
          [
            this._formBuilder.group({
              subprinciple: [undefined, [Validators.required]],
              feedback: [undefined, Validators.required]
            })
          ]
        )
      });
      this.firstDesignForm.valueChanges.subscribe(x => {
        const length = (this.firstDesignForm!.get('feedbackForms') as FormArray).controls.length;
        const controls = [];
        for (let i = 0; i < length; i++) {
          controls.push([false, Validators.required])
        }
        this.thirdDesignForm = this._formBuilder.group({
          addressed: this._formBuilder.array(controls),
        });
      })
      this.secondDesignForm = this._formBuilder.group({
        rating: [undefined, [Validators.required]],
      }); 
    } else {
      this.currentStep = 5;
      this.firstDesignForm = this._formBuilder.group({
        rating: [
          result.ratings
            .find(rating => rating.designId === this.currentDesigns![0]._id)?.rating[this.currentPrinciple]
        ],
        feedbackForms: this._formBuilder.array(result.feedbackUnits.map(feedbackUnit => {
          return this._formBuilder.group({
            subprinciple: [feedbackUnit.subaspect],
            feedback: [feedbackUnit.content],
          })
        }))
      });
      this.thirdDesignForm = this._formBuilder.group({
        addressed: this._formBuilder.array(result.feedbackUnits.map(feedbackUnit => {
            return [feedbackUnit.addressed]
        })),
      });
      this.secondDesignForm = this._formBuilder.group({
        rating: [result.ratings
          .find(rating => rating.designId === this.currentDesigns![1]._id)?.rating[this.currentPrinciple]]
      }); 
    }
  }
}

interface IUserMetadata {
  userInfo: any;
  ratedProjects: IRatedProject;
}