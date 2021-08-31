import { Component, Input, OnInit } from '@angular/core';
import { IsNotEmptyObject, validateSync } from 'class-validator';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { ImagesService } from 'src/app/core/services/apis/images/images.service';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IImage } from 'src/app/core/services/models/image.model';
import { IProject } from 'src/app/core/services/models/project.model';

@Component({
  selector: 'app-saved-project-row',
  templateUrl: './saved-project-row.component.html',
  styleUrls: ['./saved-project-row.component.sass']
})
export class SavedProjectRowComponent implements OnInit {
  @Input()
  @IsNotEmptyObject()
  project: IProject | undefined;
  images: Partial<IImage>[] = [];
  private designs?: IDesign[];
  constructor(
    private imagesService: ImagesService,
    private designsService: DesignsService,
  ) { }
  get imageUrls() {
    return this.images.map(x => `http://${x.thumbnailUrl!}`);
  }
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

}
