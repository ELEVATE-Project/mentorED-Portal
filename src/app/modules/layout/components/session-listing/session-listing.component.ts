import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services';
import { FormService } from 'src/app/core/services/form/form.service';
import { map } from 'rxjs';
import { DbService } from 'src/app/core/services/db/db.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { localKeys } from 'src/app/core/constants/localStorage.keys';

interface item {
  userId?: string;
}

@Component({
  selector: 'app-session-listing',
  templateUrl: './session-listing.component.html',
  styleUrls: ['./session-listing.component.scss']
})
export class SessionListingComponent implements OnInit {
  cardHeading: any;
  cardDetails: Array<item> = []
  mySessions: any;
  allSessions: any;
  start: any = 0;
  lastIndex: any = 4;
  selectedPage: any;
  page: any=1;
  limit: any = 4;
  noData: any = { image : '/assets/images/no-data.png', 
content:""}
  loading: boolean = false;
  userDetails: any;
  sessionsCount = 0
  showLoadMoreButton: boolean = false
  dataCount = 0
  isEnrolledSessions: any

  constructor(
    private router: Router,
    private apiService: ApiService,
    private form: FormService,
    private sessionService: SessionService,
    private localStorage:LocalStorageService,
  ) {
    this.selectedPage = router.url
  }

  ngOnInit(){
    this.localStorage
      .getLocalData(localKeys.USER_DETAILS)
      .then((userDetails) => {
        this.userDetails = userDetails
        this.getAllSession().subscribe()
      })
    this.cardHeading =
      this.selectedPage == '/enrolled-sessions' ? 'ENROLLED_SESSIONS' : 'ALL_SESSIONS'
  }

  onClickViewMore() {
    this.page = this.page + 1
    this.getAllSession().subscribe()
  }
  getAllSession() {
    this.loading = true
    this.isEnrolledSessions =
      this.selectedPage == '/enrolled-sessions' ? true : false
    let obj = {
      enrolled: this.isEnrolledSessions,
      page: this.page,
      limit: this.limit,
    }
    return this.sessionService.allSession(obj).pipe(
      map((data: any) => {
        this.cardDetails = this.cardDetails.concat(data?.result[0]?.data)
        if (!this.cardDetails.length) {
          this.noData.content=
            this.selectedPage == '/enrolled-sessions'
              ? 'NO_ENROLL_SESSION_CONTENT'
              : 'NO_ALL_SESSION_CONTENT'
        }
        this.loading = false

        this.sessionsCount = data?.result[0]?.count
        this.showLoadMoreButton =
          this.cardDetails?.length === this.sessionsCount ? false : true
      }),
    )
  }
  buttonClick(event: any) {
    switch (event.action.type) {
      case 'enrollAction':
        this.sessionService
          .enrollSession(event.data._id)
          .subscribe((result) => {
            this.cardDetails = []
            this.getAllSession().subscribe()
          })
        break
      case 'joinAction':
        let id = this.selectedPage == '/enrolled-sessions' ? event.data.sessionId : event.data._id
        this.sessionService
          .joinSession(id)
        break
    }
  }
}
