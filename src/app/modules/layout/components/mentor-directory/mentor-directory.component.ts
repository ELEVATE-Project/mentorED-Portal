import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MentorService } from 'src/app/core/services/mentor/mentor.service';
import { ApiService } from '../../../../core/services/api/api.service'
@Component({
  selector: 'app-mentor-directory',
  templateUrl: './mentor-directory.component.html',
  styleUrls: ['./mentor-directory.component.scss']
})
export class MentorDirectoryComponent implements OnInit {
  page: any = 1;
  limit: any = 9;
  mentors:any = [];
  mentorsCount:any;
  selectedAlphabet:any = "All"
  selectedMentors:any;
  allMentors:any = [];
  search:any = ''
  showLoadMoreButton: boolean = false
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
      "limit":this.limit,
      "search":this.search
    }
    return this.mentorService.getMentorDirectory(obj).pipe(
      map((data: any) => {
        this.mentors = data.result.data;
        this.mentors.forEach((data:any) => {
          this.allMentors = this.allMentors.concat(data.values)
        });
        this.mentorsCount = data?.result?.count;
        this.showLoadMoreButton = this.allMentors?.length === this.mentorsCount ? false : true
        if(this.allMentors?.length == 0){
              this.noselectedMentors = true;
            }
      }))
  }
  onClickViewMore(){
    this.page = this.page+1;
    this.getMentor().subscribe();
  }
  eventAction(event:any) {
    switch (event.type) {
      case 'cardSelect':
        this.router.navigate([`/${"mentor-profile"}/${event.data._id}`])
        break;
    }
  }
  onClickAlphabet(a:any){
    this.noselectedMentors = false;
    this.selectedMentors =[]
    this.selectedAlphabet = a;
    this.page=1
    this.allMentors=[]
    this.search=(this.selectedAlphabet=='All')?'':btoa(this.selectedAlphabet)
    this.getMentor().subscribe()
  }
}
