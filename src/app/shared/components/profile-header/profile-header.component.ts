import { Component, OnInit,Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {
  @Input() details: any
  @Input() layoutAlign: any
  selectedPage:any
  mentorDirectory:any=false;
  constructor(private translate:TranslateService,private router: Router) { 
    this.selectedPage = router.url
  }
  public isArray(arr:any ) {
    return Array.isArray(arr)
 }
  ngOnInit(): void {
   if(this.selectedPage == '/mentor-profile'){
      this.mentorDirectory = true
    }
  }
  editProfile(){
    this.router.navigate(["./edit-profile"])
  }

}
