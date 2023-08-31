import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { map } from 'rxjs';
import { API_CONSTANTS } from '../../constants/apiUrlConstants';
import { localKeys } from '../../constants/localStorage.keys';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ProfileService } from '../profile/profile.service';
import { ToastService } from '../toast/toast.service';
import { UserService } from '../user/user.service';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private router: Router,
    private profile: ProfileService,
    private toastService: ToastService,
    private db: DbService
    ) { }

  createAccount(formData: any) {
    const config = {
      url: API_CONSTANTS.CREATE_ACCOUNT,
      payload: formData,
    };
    return this.apiService.post(config).pipe(
      map((result:any) => {
          this.setUserInLocal(result).then(()=>{
        this.acceptTermsAndConditions().subscribe((res:any)=>{ 
            return result;
          })
        })
      })
    )
  }

  loginAccount(formData: any){
    const config = {
      url: API_CONSTANTS.ACCOUNT_LOGIN,
      payload: formData
    };
    return this.apiService.post(config).pipe(
      map(async (result:any) => {
        this.toastService.showMessage(result.message,'success')
        return await this.setUserInLocal(result);
      })
    )
  }
  getMailInfo(){
    const config = {
      url: API_CONSTANTS.GET_MAIL_INFO
    };
    return this.apiService.get(config).pipe(
      map((data:any) => {
        let result = _.get(data, 'result');
        return result
      })
    )
  }

  logoutAccount() {
    this.localStorage.removeLocalData([localKeys.USER_DETAILS,localKeys.TOKEN,localKeys.SELECTED_LANGUAGE]);
    this.db.clear('forms').subscribe()
    this.userService.token='';
    this.userService.userEvent.next({});
    this.router.navigate(['/auth/login']);
  }
  
  async setUserInLocal(data: any) {
    let token = _.pick(data.result, ['access_token', 'refresh_token']);
    this.userService.token = token;
    this.userService.userEvent.next(data.result.user);
    await this.localStorage.saveLocalData(localKeys.TOKEN, JSON.stringify(token));
    await this.localStorage.saveLocalData(localKeys.USER_DETAILS, JSON.stringify(data.result.user));
    await this.localStorage.saveLocalData(localKeys.SELECTED_LANGUAGE, (data.result.user.preferredLanguage)?data.result.user.preferredLanguage:'en');
    return this.profile.getProfileDetailsWithRole(data.result.user._id, data.result.user.isAMentor).subscribe((user)=>{
      return user
    })
  }

  acceptTermsAndConditions() {
    const config = {
      url: API_CONSTANTS.TERMS_CONDITIONS,
      payload: {},
    };
    return this.apiService.post(config).pipe(

    )
  }
}
