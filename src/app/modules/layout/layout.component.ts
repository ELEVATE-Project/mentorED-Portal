import { Component, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  options=[{label:"English",value:"en"},{ label: 'हिंदी', value: 'hi' },]
  selectedLanguage="en"
  user:any;
  constructor(private localStorage: LocalStorageService,private profileService:ProfileService,private router: Router, private translate: TranslateService, private toast: ToastService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.localStorage.getLocalData(localKeys.USER_DETAILS).then((data)=>{
      this.user = JSON.parse(data)
      this.profileService.newProfile$.subscribe((res)=>{
        this.user = _.isEqual(res,{}) ? this.user : res;
      })
    })
    this.localStorage.getLocalData(localKeys.SELECTED_LANGUAGE).then((lang)=>{
      if(lang)this.selectedLanguage = lang;
    })
   }

   onLogout(){
    this.router.navigate(['/logout']);
  }

  languageEvent() {
    this.localStorage.saveLocalData(localKeys.SELECTED_LANGUAGE, this.selectedLanguage).then(()=>{
      this.translate.use(this.selectedLanguage).subscribe(()=>{
        this.toast.showMessage("LANGUAGE_CHANGED_SUCCESSFULLY", "success")
        this.profileService.profileUpdate({preferredLanguage:this.selectedLanguage},false,false).subscribe();
      })
    })
  }

  goToProfile() {
    this.getDetails().then((userDetails)=>{
      if(userDetails.about){
        this.router.navigate(['/profile']);
      }else{
         this.router.navigate(['/edit-profile'])
      }
    })
  }
  goToDashboard(){
    this.router.navigate(['/dashboard'])
  }
  async getDetails() {
    return await this.profileService.profileDetails()
  }
}
