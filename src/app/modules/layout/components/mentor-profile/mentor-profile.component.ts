import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MentorService } from 'src/app/core/services/mentor/mentor.service';


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
  constructor(private router: Router, private mentorProfile:MentorService) { 
    this.mentorId = this.router.getCurrentNavigation()?.extras.state;
    
  }

  ngOnInit(): void {
    this.mentorProfile.getMentorDetails(this.mentorId.mentorID).subscribe((data:any)=>{
      this.details.data = data;
    })
  }

}
