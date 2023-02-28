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
  page: any = 1;
  limit: any = 1000;
  mentors:any = [];
  mentorsCount:any;
  selectedAlphabet:any = "All"
  selectedMentors:any;
  allMentors:any = [];
  noData:any = { image : '/assets/images/results-not-found.png', 
  content:'NO_MENTOR_IN_MENTOR_DIRECTORY_CONTENT'}
  noselectedMentors:any = false;
  alphabetsArray:any = ["All","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  constructor(private mentorService:MentorService, private apiService: ApiService, private router: Router) { }

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
        this.mentors = data.result.data;
        data.result.data.forEach((data:any) => {
          this.allMentors = this.allMentors.concat(data.values)
        });
        this.mentorsCount = data.result.count;
      }))
  }
  eventAction(event:any) {
    switch (event.type) {
      case 'cardSelect':
        this.router.navigate(["/mentor-profile"], { queryParams: { mentorID: event.data._id } })
        break;
    }
  }
  onClickAlphabet(a:any){
    this.noselectedMentors = false;
    this.selectedMentors =[]
    this.selectedAlphabet = a;
    if (this.selectedAlphabet == 'All') {
      this.selectedMentors = this.mentors
    } else {
      this.mentors.forEach((ele: any) => {
        if (ele.key == this.selectedAlphabet) {
          this.selectedMentors = ele;
        }
      });
      if(this.selectedMentors.length == 0){
        this.noselectedMentors = true;
      }
    }
  }
}
