import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { SessionService } from "src/app/core/services/session/session.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { ExitPopupComponent } from "src/app/shared/components/exit-popup/exit-popup.component";

@Component({
  selector: "app-session-detail",
  templateUrl: "./session-detail.component.html",
  styleUrls: ["./session-detail.component.scss"],
})
export class SessionDetailComponent implements OnInit {
  cardData: any;

  details = {
    enrollButton: "Enroll",
    unEnrollButton: "Un-enroll",
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

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
  }

  ngOnInit() {
    this.sessionDetailApi()
  }
  sessionDetailApi(){
    this.sessionService.getSessionDetailsAPI(this.id).subscribe((response: any) => {
      (this.details.form[0].key=='description')? false: this.details.form.unshift({title: response.title, key: 'description'})
      let readableStartDate = moment.unix(response.startDate).format("DD/MM/YYYY");
      let readableStartTime = moment.unix(response.startDate).format("hh:MM");
      this.details.data = Object.assign({}, response);
      this.details.data.startDate = readableStartDate;
      this.details.data.startTime = readableStartTime;
      this.isEnrolled = response.isEnrolled;
      this.published = response.status
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
        header: "Un-enroll session",
        label: "Are you sure you want to un-enroll from this session ?",
        unEnrollButton: "Un-enroll",
        cancelButton: "Cancel"
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
}
