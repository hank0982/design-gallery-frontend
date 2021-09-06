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

  constructor(
    private designsService: DesignsService,
    private imagesService: ImagesService,
    private savedProjectsService: SavedProjectsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    try { validateSync(this) } catch(e) {throw e}
    forkJoin(this.project!.designIds.map(designId => {
      return this.designsService.fetchDesignById(designId)
    })).subscribe(designs => {
      this.designs = designs;
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
}
