import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { HSLA, HSVA, RGBA } from 'ngx-color';
import { Observable, Subscription } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { DesignsService } from 'src/app/core/services/apis/designs/designs.service';
import { ProjectFilterDto } from 'src/app/core/services/apis/projects/projects.service';
import { EDesignAspect } from 'src/app/core/services/models/design-aspect.enum';
import { EDesignImageUsages, IDesign } from 'src/app/core/services/models/design.model';
import { IProject } from 'src/app/core/services/models/project.model';
import { ProjectListService } from '../../shared/services/project-list/project-list.service';
import { SavedProjectsService } from '../../shared/services/saved-projects/saved-projects.service';

@Component({
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.sass']
})
export class ProjectGalleryComponent implements OnInit {
  readonly categoryFilters = ['Advertising', 'Informative', 'Event', 'Research'];
  readonly textProportion = ['Plenty', 'Moderate', 'Minimal', 'None'];
  readonly textQuantity = ['Plenty', 'Moderate', 'Minimal', 'None'];
  readonly imageUsage = [...Object.values(EDesignImageUsages)];
  readonly colors = ['#9e9e9e', '#9034aa', '#4595ec', '#000000', '#52b9d1', '#594139']

  readonly appropriatenessSubtopics = [
    'Unclear message',
    'Unclear audience',
    'Missing text content',
    'Not visually enticing',
    'Improper color theme',
    'Confusing connotation',
    'Copyright permission',
    'Inappropriate image'
  ];
  readonly consistencySubtopics = [
    'Incohesive font choices',
    'Incohesive visual elements',
    'Too many fonts',
    'Incohesive color choices', 
    'Incohesive visual elements',
    'Lacks color variety',
    'Too many colors'
  ];
  readonly hierarchySubtopics = [
    'Poor content proportion',
    'Poor element arrangement', 
    'Unclear visual flow', 
    'Lacks typographic hierarchy'
  ];
  readonly emphasisSubtopics = [
    'Weak info highlighting',
    'Weak point of entry',
    'Poor color contrast',
    'Competing focal points',
    'Lacks visual weight',
  ]
  readonly readabilitySubtopics = [
    'Low contrast between text and background',
    'Poor image editing',
    'Improper letter spacing',
    'Distracting font effects',
    'Wordy sentences',
    'Difficult to read font',
    'Poor image quality',
    'Awkward sentence break',
    'Improper font stretching',
    'Improper line spacing',
    'Font too small'
  ]
  readonly alignmentSubtopics = [
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
  currentFilters: string[] = [];

  projects: IProject[] = [];
  designDictionary: Record<string, IDesign> = {}
  categories: string[] = [];
  textProportionFilter: number[] = [];
  textQuantityFilter: number[] = [];
  imageUsageFilter: EDesignImageUsages[] = [];
  mainColorFilter: string = '';
  isEvent: boolean = false;
  previousProjectSkip = 0;
  selectedSubaspects: string[] = [];
  designPrinciples = [...Object.values(EDesignAspect).filter(x => x!==EDesignAspect.OVERALL)];
  designPrinciplesWithOverall = [...Object.values(EDesignAspect).filter(x => x!==EDesignAspect.OVERALL), EDesignAspect.OVERALL];

  private subscriptions: Subscription[] = [];
  get currentSavedProjectNumber$() {
    return this.savedProjectsService.currentSavedProjectsBS.asObservable().pipe(map(x => x.length));
  }

  constructor(
    private savedProjectsService: SavedProjectsService,
    private designService: DesignsService,
    private projectListService: ProjectListService,
  ) { }
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.projectListService.currentProjectsBS.subscribe(x => this.projects = x)
    );
    this.projectListService.init();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  fetchDesign(designId: string): Observable<IDesign> {
    return this.designService.fetchDesignById(designId).pipe(first())
  }

  subaspectChange(e: Event, subaspect: string) {
    if ((e.target as HTMLInputElement).checked) {
      if (!(subaspect in this.selectedSubaspects)) {
        this.selectedSubaspects.push(subaspect);
      }
    } else {
      this.selectedSubaspects = this.selectedSubaspects.filter(x => x !== subaspect);
    }
    this.updateCurrentProject();
  }

  categoryChange(e: Event, category: string) {
    if ((e.target as HTMLInputElement).checked) {
      if (!(category in this.categories)) {
        this.categories.push(category);
      }
    } else {
      this.categories = this.categories.filter(x => x !== category);
    }
    this.updateCurrentProject();
  }

  imageUsageChange(e: Event, imageUsage: EDesignImageUsages) {
    if ((e.target as HTMLInputElement).checked) {
      if (!(imageUsage in this.imageUsageFilter)) {
        this.imageUsageFilter.push(imageUsage);
      }
    } else {
      this.imageUsageFilter = this.imageUsageFilter.filter(x => x !== imageUsage);
    }
    this.updateCurrentProject();
  }

  amountOfTextChange(e: Event, amountOfText: number) {
    const textProportion = this.textProportion.length - amountOfText - 1;
    if ((e.target as HTMLInputElement).checked) {
      if (!(textProportion in this.textProportionFilter)) {
        this.textProportionFilter.push(textProportion);
      }
    } else {
      this.textProportionFilter = this.textProportionFilter.filter(x => x !== textProportion);
    }
    this.updateCurrentProject();
  }

  textQuantityChange(e: Event, textQuantity: number) {
    const textQ = this.textQuantity.length - textQuantity - 1;
    if ((e.target as HTMLInputElement).checked) {
      if (!(textQ in this.textQuantityFilter)) {
        this.textQuantityFilter.push(textQ);
      }
    } else {
      this.textQuantityFilter = this.textQuantityFilter.filter(x => x !== textQ);
    }
    this.updateCurrentProject();
  }

  changeColor(color: HSLA | HSVA | RGBA | string ) {
    this.mainColorFilter = color as string;
    this.updateCurrentProject();
  }

  onScroll() {
    this.projectListService.updateCurrentProject();
  }

  private updateCurrentProject() {
    const filters = this.getCurrentFilters();
    this.projectListService.updateCurrentFilters(filters);
    this.currentFilters = this.generateCurrentAppliedFilters();
  }

  private getCurrentFilters() {
    const projectFilterDto = plainToClass(ProjectFilterDto, {
      categories: this.categories.filter(x => x !== undefined) as string[],
      textProportion: this.textProportionFilter,
      mainColor: this.mainColorFilter,
      textQuantity: this.textQuantityFilter,
      imageUsage: this.imageUsageFilter,
      subaspects: this.selectedSubaspects
    })
    return projectFilterDto;
  }

  private generateCurrentAppliedFilters() {
    const filterTags: string[] = [];
    this.categories.forEach(x => filterTags.push(`Category: ${x}`));
    this.textQuantityFilter.forEach(x => filterTags.push(`Text Quantity: ${this.textQuantity[this.textQuantity.length - x - 1]}`));
    this.textProportionFilter.forEach(x => filterTags.push(`Text Proportion: ${this.textProportion[this.textProportion.length - x - 1]}`));
    this.imageUsageFilter.forEach(x => filterTags.push('Image Usage: ' + String(x).toLowerCase()));
    this.selectedSubaspects.forEach(x => filterTags.push('Subaspects: ' + x));
    if (this.mainColorFilter) {
      filterTags.push(`Dominant Color: ${this.mainColorFilter}`);
    }
    return filterTags;
  }
}
