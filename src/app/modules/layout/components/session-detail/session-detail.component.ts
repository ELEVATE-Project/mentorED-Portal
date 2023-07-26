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
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: "app-session-detail",
  templateUrl: "./session-detail.component.html",
  styleUrls: ["./session-detail.component.scss"],
})
export class SessionDetailComponent implements OnInit {
  cardData: any;

  details = {
    enrollButton: "ENROLL",
    confirmButton: "UN_ENROLL",
    editSession: "EDIT_SESSION",
    DeleteSession: "DELETE_SESSION",
    form: [
      {
        title: "SESSION_DATE",
        key: "startDate",
      },
      {
        title: "SESSION_TIME",
        key: "startTime",
      },
      {
        title: "MEETING_PLATFORM",
        key: "meetingInfo",
      },
      {
        title: "MENTOR_NAME",
        key: "mentorName",
      },
      {
        title: "RECOMENDED_FOR",
        key: "recommendedFor",
      },
      {
        title: "MEDIUM",
        key: "medium",
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
      startTime: "",
      endDate:"",
      meetingInfo:""
    },
  };
  id: any;
  readableStartDate: any;
  startDate: any;
  layout = 'start start'
  title: any;
  isEnrolled: any;
  published: any;
  userDetails: any;
  isCreator: boolean;
  paginatorConfigData:any;
  isEnabled:any;
  pastSession:any;
  sessionId:any
  snackbarRef:any;
  isJoinEnabled: any;
  fromSessionDetails = true;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private localStorage:LocalStorageService,
    private pageTitle: PageTitleService,
    private location: Location,
    private _snackBar: MatSnackBar
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
      this.sessionId = response._id
      let readableStartDate = moment.unix(response.startDate).format("DD/MM/YYYY");
      let readableStartTime = moment.unix(response.startDate).format("hh:mm A");
      this.details.data.endDate = moment.unix(response.endDate).format("DD/MM/YYYY");
      let currentTimeInSeconds = Math.floor(Date.now() / 1000)
      this.isEnabled = (((response.startDate - currentTimeInSeconds) < 600) && !(response?.meetingInfo?.platform == 'OFF'))? true : false
      this.details.data = Object.assign({}, response);
      this.details.data.startDate = readableStartDate;
      this.details.data.startTime = readableStartTime;
      this.details.data.meetingInfo = response.meetingInfo.platform
      var responseData = response;
      (response)?this.creator(response):false;
      if((response.meetingInfo.platform == 'OFF') && this.isCreator && response.status=='published'){
        this.openSnackBar('Meeting link is not added, please add a link.', 'Add meeting link')
      }
      let  buttonName = this.isCreator ? 'START':'JOIN'
      let method = this.isCreator ? 'startSession':'joinSession'
      this.pastSession = (this.details.data.status ==='completed') ? false : true
      let showButton = (this.details?.data?.isEnrolled && (this.details.data.status ==='published'|| this.details.data.status ==='live') || this.isCreator) && this.pastSession
      let showShareButton = ((this.details.data.status ==='published'|| this.details.data.status ==='live')  || this.isCreator) && this.pastSession
      responseData.startDate = (response.startDate>0)?moment.unix(response.startDate).toLocaleString():response.startDate;
      responseData.endDate = (response.endDate>0)?moment.unix(response.endDate).toLocaleString():response.endDate;
      this.paginatorConfigData = {
        buttonConfig:[{buttonName:buttonName,cssClass:"startButton",isDisable:!this.isEnabled, service: 'sessionService', method: method, passingParameter:{id : this?.id, data: responseData}, showButton:showButton},
        {buttonName:'SHARE_SESSION',cssClass:"shareButton", matIconName:'share', isDisable:false,service: 'utilService', method: 'shareButton',passingParameter:"SHARE_SESSION",showButton:showShareButton}]
      }
      this.pageTitle.editButtonConfig(this.paginatorConfigData)
    });
    this.router.events.subscribe(
      event => {
        this.pageTitle.editButtonConfig({})
      });
  }
  onEnroll() {
    if(this.userDetails.about){
      let result = this.sessionService.enrollSession(this.id).subscribe(() =>{
        this.sessionDetailApi()
      })
    }else{
      this.router.navigate(['/edit-profile'])
    }
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
    this.router.navigate(['/edit-session', this.id], {queryParams:{from:this.fromSessionDetails}})
  }
  deleteSession(){
    let dialogRef = this.dialog.open(ExitPopupComponent, {
      data: {
        header: "DELETE_SESSION",
        label: "ARE_YOU_SURE_WANT_TO_DELETE_SESSION",
        confirmButton: "YES_DELETE",
        cancelButton: 'NO_DO_NOT_DELETE'
      }
    });
    const result = dialogRef.componentInstance.buttonClick.subscribe(()=> {
      this.deleteSessions()
    })
  }

   ngOnDestroy(){
    this.pageTitle.editButtonConfig({})
    this?.snackbarRef?.dismiss();
   }
   deleteSessions(){
    let result = this.sessionService.deleteSession(this.id).subscribe(() => {
      this.router.navigate(['/created-sessions'])
    })
   }

   openSnackBar(message: any, action?: any) {
    this.snackbarRef = this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['add-platform-snackbar'],
    });
    this.snackbarRef.onAction().subscribe(() =>{
      this.router.navigate([`/${"edit-session"}/${this.sessionId}`], {queryParams:{ secondStepper:true, from:this.fromSessionDetails}})
    })
  }
 
}
