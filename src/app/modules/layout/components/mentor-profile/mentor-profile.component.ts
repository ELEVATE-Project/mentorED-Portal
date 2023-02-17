import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MentorService } from 'src/app/core/services/mentor/mentor.service';
import { SessionService } from 'src/app/core/services/session/session.service';

interface item {
  userId?: string;
}
@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.scss']
})
export class MentorProfileComponent implements OnInit {
  mentorId :any;
  details: any = {
    buttonLabel: "EDIT_PROFILE",
    form: [
      {
        title: 'ABOUT',
        key: 'about',
      },
      {
        title: 'DESIGNATION',
        key: 'designation',
      },
      {
        title: 'YEAR_OF_EXPERIENCE',
        key: 'experience',
      },
      {
        title: "KEY_AREAS_OF_EXPERTISE",
        key: "areasOfExpertise"
      },
      {
        title: "EDUCATION_QUALIFICATION",
        key: "educationQualification"
      },
      {
        title: "LANGUAGES",
        key: "languages"
      }
    ],
    menteeForm: ['SESSIONS_ATTENDED'],
    data: {},
  };
  layout= 'start start'
  mentorDirectory = true;
  mentorUpComingSession: Array<item> = [];
  showLoadMoreButtonUpcomingSession: boolean = false;
  page = 1;
  limit = 4;
  noData:any='NO_MENTOR_UPCOMING_SESSIONS_CONTENT';
  constructor(private router: Router, private route: ActivatedRoute, private mentorProfile: MentorService, private sessionService: SessionService) {
    this.route.queryParams.subscribe(
      params => {
        this.mentorId = params;
      }
    )}
  ngOnInit(): void {
    this.mentorProfile.getMentorDetails(this.mentorId.mentorID).subscribe((data:any)=>{
      this.details.data = data;
    })
    this.getUpcomingSession()
  }
  getUpcomingSession() {
    let obj = {
      "id": this.mentorId.mentorID,
      "page": this.page,
      "limit": this.limit
    }
    this.sessionService.mentorUpComingSession(obj).subscribe((data: any) => {
      this.mentorUpComingSession = this.mentorUpComingSession.concat(
        data.result[0].data
      )
      this.showLoadMoreButtonUpcomingSession =
        !(data.result[0].count == this.mentorUpComingSession.length)
    })
  }

  buttonClick(event: any) {
    switch (event.action.type) {
      case 'enrollAction':
        this.sessionService
          .enrollSession(event.data._id)
          .subscribe((result) => {
            this.mentorUpComingSession = []
            this.getUpcomingSession()
          })
        break
      case 'joinAction':
        let id = event.data._id;
        this.sessionService
          .joinSession(id)
        break
    }
  }
  onClickViewMoreUpcomingSessions() {
    this.page = this.page + 1
    this.getUpcomingSession()
  }
}
