import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { SessionService } from "src/app/core/services/session/session.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import * as moment from "moment";
import { PageTitleService } from "src/app/core/services/page-title/page-title.service";

@Component({
  selector: "app-session-detail",
  templateUrl: "./session-detail.component.html",
  styleUrls: ["./session-detail.component.scss"],
})
export class SessionDetailComponent implements OnInit {
  cardData: any;
  isEnrolled = false

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

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private pageTitle: PageTitleService
  ) {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
  }

  ngOnInit(): void {
    this.sessionService.getSessionDetailsAPI(this.id).subscribe((response: any) => {
      this.details.form.unshift({
        title: response.title,
        key: 'description'
      })
      let readableStartDate = moment.unix(response.startDate).format("DD/MM/YYYY");
      let readableStartTime = moment.unix(response.startDate).format("hh:MM");
      this.details.data = Object.assign({}, response);
      this.details.data.startDate = readableStartDate
      this.details.data.startTime = readableStartTime
      this.pageTitle.editTItle(response.title)
    });
    this.router.events.subscribe(
      event => {
        this.pageTitle.editTItle('');
      });
  }

   ngOnDestroy(){
    this.pageTitle.editTItle('');
   }
}
