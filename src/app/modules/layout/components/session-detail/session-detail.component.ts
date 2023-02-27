import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { SessionService } from "src/app/core/services/session/session.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as moment from "moment";
import { PageTitleService } from "src/app/core/services/page-title/page-title.service";
import { MatDialog } from '@angular/material/dialog';
import { ExitPopupComponent } from "src/app/shared/components/exit-popup/exit-popup.component";
import { LocalStorageService } from "src/app/core/services/local-storage/local-storage.service";
import { localKeys } from "src/app/core/constants/localStorage.keys";
import { Location} from '@angular/common';

@Component({
  selector: "app-session-detail",
  templateUrl: "./session-detail.component.html",
  styleUrls: ["./session-detail.component.scss"],
})
export class SessionDetailComponent implements OnInit {
  cardData: any;

  details = {
    enrollButton: "Enroll",
    confirmButton: "Un-enroll",
    editSession: "Edit session",
    DeleteSession: "Delete session",
    form: [
      {
        title: "RECOMENDED_FOR",
        key: "recommendedFor",
      },
      {
        title: "MEDIUM",
        key: "medium",
      },{
        title: "MENTOR_NAME",
        key: "mentorName",
      },
      {
        title: "SESSION_DATE",
        key: "startDate",
      },
      {
        title: "SESSION_TIME",
        key: "startTime",
      },
    ],
    data: {
      image: [],
      description: '',
      mentorName: null,
      status:null,
      isEnrolled:null,
      title:"",
      startDate:"",
      startTime: ""
    },
  };
  id: any;
  readableStartDate: any;
  startDate: any;
  endDate: any;
  layout = 'start start'
  title: any;
  isEnrolled: any;
  published: any;
  userDetails: any;
  isCreator: boolean;
  paginatorConfigData:any;
  isEnabled:any;
  pastSession:any;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private localStorage:LocalStorageService,
    private pageTitle: PageTitleService,
    private location: Location,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
  }

  async ngOnInit() {
    const details = await this.localStorage.getLocalData(localKeys.USER_DETAILS);
    this.userDetails = JSON.parse(details)
    this.sessionDetailApi()
  }
  sessionDetailApi(){
    this.sessionService.getSessionDetailsAPI(this.id).subscribe((response: any) => {
      (this.details.form[0].key=='description')? false: this.details.form.unshift({title: response.title, key: 'description'})
      let readableStartDate = moment.unix(response.startDate).format("DD/MM/YYYY");
      let readableStartTime = moment.unix(response.startDate).format("hh:mm A");
      let currentTimeInSeconds = Math.floor(Date.now() / 1000)
      this.isEnabled = ((response.startDate - currentTimeInSeconds) < 600) ? true : false
      this.pastSession = (response.endDate < currentTimeInSeconds) ? false : true
      this.details.data = Object.assign({}, response);
      this.details.data.startDate = readableStartDate;
      this.details.data.startTime = readableStartTime;
      var response = response;
      (response)?this.creator(response):false;
      let  buttonName = this.isCreator ? 'START':'JOIN'
      let method = this.isCreator ? 'startSession':'joinSession'
      let showButton = (this.details?.data?.isEnrolled && this.details.data.status ==='published' || this.isCreator) && this.pastSession
      this.paginatorConfigData = {
        title:response.title,
        buttonConfig:[{buttonName:buttonName,cssClass:"startButton",isDisable:!this.isEnabled, service: 'sessionService', method: method, passingParameter:this.id, showButton:showButton},
        {buttonName:'SHARE_SESSION',cssClass:"shareButton", matIconName:'share', isDisable:false,service: 'utilService', method: 'shareButton',showButton:true}]
      }
      this.pageTitle.editButtonConfig(this.paginatorConfigData)
    });
    this.router.events.subscribe(
      event => {
        this.pageTitle.editButtonConfig({})
      });
  }
  onEnroll() {
    let result = this.sessionService.enrollSession(this.id).subscribe(() =>{
      this.sessionDetailApi()
    })
  }
  unEnrollDialogBox(){
    let dialogRef = this.dialog.open(ExitPopupComponent, {
      data: {
        header: "UN_ENROLL_SESSION",
        label: "ARE_YOU_SURE_WANT_TO_UN_ENROLL",
        confirmButton: "UN_ENROLL",
        cancelButton: 'CANCEL'
      }
    });
    const result = dialogRef.componentInstance.buttonClick.subscribe(()=> {
      this.unEnroll()
  })
  }
  unEnroll(){
    let result = this.sessionService.unEnrollSession(this.id).subscribe(() => {
      this.sessionDetailApi()
    })
  }
  creator(response:any){
    if(this.userDetails){
      this.isCreator = this.userDetails._id == response.userId ? true : false;
    }  
  }
  editSession(){
    this.router.navigate(['/edit-session', this.id])
  }
  deleteSession(){
    let dialogRef = this.dialog.open(ExitPopupComponent, {
      data: {
        header: "DELETE_SESSION",
        label: "ARE_YOU_SURE_WANT_TO_DELETE_SESSION",
        confirmButton: "YES_DELETE",
        cancelButton: 'CANCEL'
      }
    });
    const result = dialogRef.componentInstance.buttonClick.subscribe(()=> {
      this.deleteSessions()
    })
  }

   ngOnDestroy(){
    this.pageTitle.editButtonConfig({})
   }
   deleteSessions(){
    let result = this.sessionService.deleteSession(this.id).subscribe(() => {
      this.sessionDetailApi()
      this.location.back()
    })
   }
}
