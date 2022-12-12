import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_CONSTANTS } from '../../constants/apiUrlConstants';
import { localKeys } from '../../constants/localStorage.keys';
import { HttpOptions } from '../../interfaces/httpOptions';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ToastService } from '../toast/toast.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = environment.base_url;
  private currentLanguage: any = this.localStorage.getLocalData(localKeys.SELECTED_LANGUAGE);
  private timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  private httpHeaders: any;

  constructor(private http: HttpClient,private toastService : ToastService,private userService: UserService, private localStorage: LocalStorageService, private injector: Injector) { 
    this.setHeader();
  }

  async setHeader(): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        let userToken = (await this.userService.getUserToken()) ? 'bearer ' + (await this.userService.getUserToken()).access_token : '';
        const headers = {
          'X-auth-token': userToken ? userToken : '',
          'Content-Type': 'application/json',
          'timeZone': this.timeZone,
          'accept-language': 'en'
        };
        this.httpHeaders = headers;
        resolve(true)
      } catch (error) {
      }
    });
  }

  get(config: any) {
    console.log(this.httpHeaders);
    return this.http.get(`${this.baseUrl}${config.url}`, {headers: this.httpHeaders})
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  post(config: any) {
    return this.http.post(`${this.baseUrl}${config.url}`, config.payload, {headers: this.httpHeaders})
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  delete() { }

  patch() { }

 handleError(error: HttpErrorResponse) {
    // Handle the HTTP error here

    this.errorToast(error.error.message);
    switch (error.status) {
      case 401:
        return throwError("UNAUTHORIZED")

      default:
        return throwError(error)
    }
   
  }
  errorToast(message:any) {
    this.toastService.showMessage(message, "error")

  }
}
