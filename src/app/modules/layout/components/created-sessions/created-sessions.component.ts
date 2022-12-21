import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants'
import { map } from 'rxjs';


@Component({
  selector: 'app-created-sessions',
  templateUrl: './created-sessions.component.html',
  styleUrls: ['./created-sessions.component.scss']
})
export class CreatedSessionsComponent implements OnInit {
  noData: any = "NO_CREATED_SESSION_CONTENT"
  start: any = 0;
  lastIndexUpcomingSessions: any = 2;
  lastIndexPastSessions: any = 2;
  upcomingCardDetails: any;
  pastCardDetails: any;
  page: any = 1;
  limit: any = 4;
  status: any = "completed";
  loading: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user')
    user = JSON.parse(user)
    this.getUpcomingSessions(user._id).subscribe((upcomingSessions)=>{
      this.upcomingCardDetails = upcomingSessions
    })
    this.getpastSessions().subscribe((pastSessions)=>{
      this.pastCardDetails = pastSessions
    })

  }

  onClickViewMoreUpcomingSessions() {

    this.lastIndexUpcomingSessions = this.upcomingCardDetails.length
  }
  onClickViewMorePastSessions() {
    this.lastIndexPastSessions = this.pastCardDetails.length
  }

  getUpcomingSessions(id: any) {
    const config = {
      url: API_CONSTANTS.UPCOMING_SESSIONS + id + "?page=1&limit=100",
      payload: {}
    };
    this.loading = true;
    return this.apiService.get(config).pipe(
      map((data: any) => {
        this.loading = false;
        return (data.result && data.result.length) ? data.result[0].data : [];
      })
    )
  }

  getpastSessions() {
    const config = {
      url: API_CONSTANTS.GET_SESSIONS_LIST + this.status + "1&limit=100",
      payload: {}
    };
    this.loading = true;
    return this.apiService.get(config).pipe(
      map((data: any) => {
        this.loading = false;
        return data.result.data
      })
    )
  }

}
