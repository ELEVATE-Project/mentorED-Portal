import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MentorService } from 'src/app/core/services/mentor/mentor.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { API_CONSTANTS } from "../../../../core/constants/apiUrlConstants";
import { ApiService } from '../../../../core/services/api/api.service'
@Component({
  selector: 'app-mentor-directory',
  templateUrl: './mentor-directory.component.html',
  styleUrls: ['./mentor-directory.component.scss']
})
export class MentorDirectoryComponent implements OnInit {
  page: any;
  limit: any;
  mentors:any = [];
  mentorsCount:any;
  constructor(private mentorService:MentorService, private apiService:ApiService,private router: Router) { }

  ngOnInit(): void {
    this.getMentor().subscribe()
  }
  getMentor(){
    let obj={
      "page":this.page,
      "limit":this.limit
    }
    return this.mentorService.getMentorDirectory(obj).pipe(
      map((data: any) => {
        this.mentors = this.mentors.concat(data.result.data);
      this.mentorsCount = data.result.count;
      }))
    
  }
  eventAction(event:any) {
    switch (event.type) {
      case 'cardSelect':
        this.router.navigate(["/mentor-profile"],{ state: { mentorID: event.data._id } })
        break;
    }
  }
}
