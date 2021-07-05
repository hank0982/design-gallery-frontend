import { Component, Input, OnInit } from '@angular/core';
import { IsNotEmptyObject, validateSync } from 'class-validator';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { IDesign } from 'src/app/core/services/models/design.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectPreviewComponent } from '../project-preview/project-preview.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.sass']
})
export class ProjectCardComponent implements OnInit {
  @Input()
  @IsNotEmptyObject()
  project: IProject | undefined;

  designs: IDesign[] = [];
  imageUrls: string[] = [];
  constructor(
    private designService: DesignsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    try { validateSync(this) } catch(e) {throw e}
    forkJoin(this.project!.designIds.map(designId => {
      return this.designService.fetchDesignById(designId)
    })).subscribe(designs => {
      this.designs = designs;
      this.imageUrls = designs.map(x => x.imageUrl);
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(
      ProjectPreviewComponent, {
        data: {
          project: this.project,
          designs: this.designs 
        },
        maxWidth: '90%',
        width: '90%',
        maxHeight: '100%',
        height: '100%',
        backdropClass: 'black-backdrop'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
