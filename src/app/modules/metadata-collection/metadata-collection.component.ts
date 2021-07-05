import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { forkJoin, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { ProjectsService } from 'src/app/core/services/apis/projects/projects.service';
import { RatingsService } from 'src/app/core/services/apis/ratings/ratings.service';
import { IUserRatedProjectsDict, UsersService } from 'src/app/core/services/apis/users/users.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { CreateRatingDto } from 'src/app/core/services/models/rating.model';

@Component({
  selector: 'app-metadata-collection',
  templateUrl: './metadata-collection.component.html',
  styleUrls: ['./metadata-collection.component.sass']
})
export class MetadataCollectionComponent implements OnInit {
  projects: IProject[] | undefined;
  currentIndex = 0;
  currentDesigns: IDesign[] | undefined;
  principleRatings: {
    [designIndex: number]: {
      [principleName: string]: number;
    };
  } = {
    0: {
      [EDesignAspect.ALIGNMENT]: 0,
      [EDesignAspect.APPROPRIATENESS]: 0,
      [EDesignAspect.CONSISTENCY]: 0,
      [EDesignAspect.EMPHASIS]: 0,
      [EDesignAspect.HIERARCHY]: 0,
    },
    1: {
      [EDesignAspect.ALIGNMENT]: 0,
      [EDesignAspect.APPROPRIATENESS]: 0,
      [EDesignAspect.CONSISTENCY]: 0,
      [EDesignAspect.EMPHASIS]: 0,
      [EDesignAspect.HIERARCHY]: 0,
    }
  };
  isModalVisible = true;
  ratings = [1,2,3,4,5];
  designPrinciples = [...Object.values(EDesignAspect)];
  userMetadata: IUserMetadata | undefined;

  constructor(
    private route: ActivatedRoute,
    private designService: DesignsService,
    private ratingService: RatingsService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.fetchRaterMetadata()
    this.projectsService.fetchAllProjects(0, 0).pipe(first()).subscribe(projects => {
      this.projects = projects.results;
      this.refetchNewDesigns();
    });
  }

  private fetchRaterMetadata() {
    const raterId = this.route.snapshot.paramMap.get('id');
    if (raterId) {
      forkJoin({
        userInfo: this.usersService.fetchUserById(raterId),
        ratedProjects: this.usersService.fetchUserRatedProjects(raterId)
      }).pipe(first()).subscribe(x => {
        this.userMetadata = x
      });
    }
  }

  changeCurrentIndex(index: number) {
    this.currentIndex = index;
    this.currentDesigns = undefined;
    this.refetchNewDesigns();
    this.principleRatings = {
      0: {
        [EDesignAspect.ALIGNMENT]: 0,
        [EDesignAspect.APPROPRIATENESS]: 0,
        [EDesignAspect.CONSISTENCY]: 0,
        [EDesignAspect.EMPHASIS]: 0,
        [EDesignAspect.HIERARCHY]: 0,
      },
      1: {
        [EDesignAspect.ALIGNMENT]: 0,
        [EDesignAspect.APPROPRIATENESS]: 0,
        [EDesignAspect.CONSISTENCY]: 0,
        [EDesignAspect.EMPHASIS]: 0,
        [EDesignAspect.HIERARCHY]: 0,
      }
    }
  }

  checkPreviousRating(principle: string, rate: number) {
    console.log(principle)
    console.log(rate)
  }

  private areAllPrinciplesInCurrentDesignRated() {
    let isRated = true;
    [0, 1].forEach(designIndex => {
      Object.values(EDesignAspect).forEach(aspect => {
        if (this.principleRatings[designIndex][aspect] <= 0) {
          isRated = false;
        }
      })
    })
    return isRated;
  }

  clickOption(designIndex: number, principle: string) {
    const raterId = this.route.snapshot.paramMap.get('id');
    if (raterId && this.currentDesigns) {
      this.ratingService.createOrUpdateRating(plainToClass(CreateRatingDto, {
        raterId,
        designId: this.currentDesigns[designIndex]._id,
        rating: this.principleRatings[designIndex][principle],
        aspect: principle
      })).subscribe(
        x => {
          if (this.areAllPrinciplesInCurrentDesignRated()) {
            this.fetchRaterMetadata();
            this.changeCurrentIndex(this.currentIndex + 1);
          }
        }
      )
    }
  }

  private refetchNewDesigns() {
    const raterId = this.route.snapshot.paramMap.get('id');
    if (this.projects && raterId){
      forkJoin(this.projects[this.currentIndex].designIds.map(designId => {
        return this.designService.fetchDesignById(designId)
      })).pipe(tap(x => console.log(x), first())).subscribe(designs => {
        this.currentDesigns = designs;
        this.ratingService.fetchRatingByRaterIdAndDesignId(raterId, designs[1]._id).pipe(first()).subscribe(result => {
          if (result?.results?.[0]?.rating) {
            this.principleRatings[1] = result.results[0].rating;
          }
        })
        this.ratingService.fetchRatingByRaterIdAndDesignId(raterId, designs[0]._id).pipe(first()).subscribe(result => {
          if (result?.results?.[0]?.rating) {
            this.principleRatings[0] = result.results[0].rating;
          }        
        })
      });
    }
  }
}

interface IUserMetadata {
  userInfo: any;
  ratedProjects: IUserRatedProjectsDict;
}