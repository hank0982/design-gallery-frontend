import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectPreviewComponent } from '../../shared/components/project-preview/project-preview.component';

@Component({
  template: ''
})
export class ProjectModalComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog?: MatDialogRef<ProjectPreviewComponent, any> = undefined;

  constructor(
    private dialog: MatDialog,
    route: ActivatedRoute,
    router: Router
  ) {
    route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
        // When router navigates on this component is takes the params and opens up the photo detail modal
        console.log(params)
        this.currentDialog = this.dialog.open(
          ProjectPreviewComponent, {
            data: {
              id: params.id
            },
            maxWidth: '90%',
            width: '90%',
            maxHeight: '100%',
            height: '100%',
            backdropClass: 'black-backdrop'
          }
        );

        // Go back to home page after the modal is closed
        this.currentDialog.afterClosed().subscribe(result => {
            router.navigateByUrl('/gallery');
        }, reason => {
            router.navigateByUrl('/gallery');
        });
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
