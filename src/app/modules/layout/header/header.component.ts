import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash-es'
import { filter } from 'rxjs'
import { localKeys } from 'src/app/core/constants/localStorage.keys'
import { AuthService } from 'src/app/core/services/auth/auth.service'
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service'
import { ProfileService } from 'src/app/core/services/profile/profile.service'
import { ToastService } from 'src/app/core/services/toast/toast.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuToggleEvent = new EventEmitter()
  letter:any;
  user:any;
  selectFontStyle = 'bold';
  options = [
    { label: 'English', value: 'en' },
    { label: 'हिंदी', value: 'hi' },
  ]
  selectedLanguage: string = 'en';
  showSearchbar = false;
  searchText: string

  constructor(private translate: TranslateService, private profile: ProfileService, private localStorage: LocalStorageService, private router: Router, private activatedRoute: ActivatedRoute, private toast: ToastService,private profileService: ProfileService) {
    this.checkForSearchbar();
    this.localStorage.getLocalData(localKeys.SELECTED_LANGUAGE).then((lang)=>{
      this.selectedLanguage = lang ? lang : this.translate.currentLang;
    })
  }
  ngOnInit(): void {
    this.localStorage.getLocalData(localKeys.USER_DETAILS).then((data)=>{
      this.letter = data?JSON.parse(data).name[0]:'U';
      this.user = JSON.parse(data)
      this.profile.newProfile$.subscribe((res)=>{
        this.user = _.isEqual(res,{}) ? this.user : res;
      })
    });
    this.localStorage.getLocalData(localKeys.SELECTED_LANGUAGE).then((lang)=>{
      if(lang)this.selectedLanguage = lang;
    })
  }
  onClick() {
    this.menuToggleEvent.emit()
  }
  onLogout(){ 
    this.router.navigate(['/logout']);
  }
  checkForSearchbar() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),)
    .subscribe(() => {
      const child: any = this.activatedRoute.firstChild;
      this.showSearchbar = (child.snapshot.data['showSearchbar'])?child.snapshot.data['showSearchbar'] : false;
    })
  }
  checkInput(){
    this.searchText=this.searchText.replace(/^ +/gm, '')
  }
  onSearch() {
    
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
  goHome(){
    this.router.navigate(['/home'])
  }
}
