import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/core/services/profile/profile.service'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
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
  layoutAlign:any='center center';
  constructor(private router: Router, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getDetails().then((userDetails)=>{
      if(userDetails.about){
        this.details.data = userDetails
      }
    })
   
  }
  async getDetails() {
    return await this.profileService.profileDetails()
  }
  
}
