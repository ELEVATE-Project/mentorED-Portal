import { Location, PlatformLocation} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UtilService } from 'src/app/core/services/util/util.service';
import { SharePopupComponent } from 'src/app/shared/components/share-popup/share-popup.component';



@Component({
  selector: 'app-page-navigator',
  templateUrl: './page-navigator.component.html',
  styleUrls: ['./page-navigator.component.scss']
})
export class PageNavigatorComponent implements OnInit {

  pageNavigatorArray: any;
 
  mentorNavigationArray = [{ 'name': 'home', 'url': '/home', 'label': 'HOME' },
  { 'name': 'enrolled sessions', 'url': '/enrolled-sessions', 'label': 'ENROLLED_SESSIONS' },
  { 'name': 'created sessions', 'url': '/created-sessions', 'label': 'CREATED_SESSIONS' },
  { 'name': 'mentor directory', 'url': '/mentor-directory', 'label': 'MENTOR_DIRECTORY' }]

  menteeNavigationArray = [{ 'name': 'home', 'url': '/home', 'label': 'HOME' },
  { 'name': 'enrolled sessions', 'url': '/enrolled-sessions', 'label': 'ENROLLED_SESSIONS' },
  { 'name': 'mentor directory', 'url': '/mentor-directory', 'label': 'MENTOR_DIRECTORY' }]

  labels: any;
  appTitle = this.titleService.getTitle();
  pageTitle: any;
  userDetails: any;
  navigationArray: any;
  onBackUrl:any;
  url: any;
  showShareButton: any;
  subscription: any;
  paginatorConfig:any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,  private utilService:UtilService, private sessionService: SessionService,private translate: TranslateService, private profileService: ProfileService, private titleService: Title, private location: Location,private pageTitleService: PageTitleService) {
    this.setTitle().then(()=>{
      this.subscription = this.pageTitleService.newButtonConfig$.subscribe((paginatorConfig)=>{
        this.paginatorConfig = paginatorConfig;
        if(this.paginatorConfig.title){
          this.pageTitle = this.paginatorConfig.title
        }
       }) 
    }) 
  }
  
  ngOnInit(): void {
    this.profileService.profileDetails().then((userDetails) => {
      this.userDetails = userDetails;
      this.navigationArray = (userDetails.isAMentor)?this.mentorNavigationArray:this.menteeNavigationArray;
    }) 
  }

  async setTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const child: any = this.activatedRoute.firstChild;
      this.pageTitle = child.snapshot.data['title'] || "";
      this.onBackUrl = child.snapshot.data['onBackUrl'] || "";
      this.showShareButton = child.snapshot.data['showShareButton']
    })
  }
  onBack(){
    if(this.onBackUrl){
      this.router.navigate([this.onBackUrl], { replaceUrl: true })
    } else {
      this.location.back()
    }
  }
  
  onClickSession(buttonConfig:any){
    const that: any = this;
    that[buttonConfig.service][buttonConfig.method](buttonConfig?.passingParameter)
  }
}
