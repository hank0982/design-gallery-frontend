
import { Component, OnInit, ViewChild } from '@angular/core';
import { Console, debug } from 'console';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import { Router } from '@angular/router';
import { UserActivityService } from 'src/app/core/services/apis/user-activity/user-activity.service';
import { IUserActivity } from 'src/app/core/services/models/user-activity.model';
import { IUser } from 'src/app/core/services/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ReplayPreviewComponent } from '../projects/shared/components/replay-preview/replay-preview.component';

@Component({
	templateUrl: './replay.component.html',
	styleUrls: ['./replay.component.sass']
})

export class ReplayComponent implements OnInit {

	currentDialog?: MatDialogRef<ReplayPreviewComponent, any> = undefined;


	//TODO: check the type of return object (mongodb obj?)
	userActivities: any = [];
	userActivitiesMap: Map<string, IUserActivity[] | undefined> = new Map()


	@ViewChild(MatSelectionList) userActivityList!: MatSelectionList;


	constructor(
		private userActivityService: UserActivityService,
		private dialog: MatDialog,
		route: ActivatedRoute,
		router: Router
	) {


	 }

	ngOnInit(): void {
		this.userActivityService.fetchAllUserActivities().subscribe(userActivities => {
			this.userActivities = userActivities				
			this.sortUserActivities()
		})
	}

	sortUserActivities() {
			console.log("Running")
			for (let index = 0; index < this.userActivities.length; index++) {
				const element = this.userActivities[index]
				// TODO: wtf why has function always be false
				if ( !this.userActivitiesMap.has(element.userId[0]) ) {
					this.userActivitiesMap = this.userActivitiesMap.set(element.userId[0], [])
					console.log("created new list for " + element.userId[0])
				} 
				let newList = this.userActivitiesMap.get(element.userId[0])?.concat(new Array(element))
				this.userActivitiesMap = this.userActivitiesMap.set(element.userId[0], newList)
			}

			// this.userActivitiesMap.forEach((element: any) => {
			// 	console.log(element)
			// })
	}

	onUserClicked(userActivity: any) {
		//TODO: new site to show replay
		console.log(userActivity)
		this.currentDialog = this.dialog.open(
			ReplayPreviewComponent, {
				data: {
					id: userActivity.userId
				},
				maxWidth: '90%',
				width: '90%',
				maxHeight: '100%',
				height: '100%',
				backdropClass: 'black-backdrop'
			}
		);
		
		this.currentDialog.afterClosed().subscribe(result => {
			
		})
	}

}

// /gallery/replay/userid/user-activityid