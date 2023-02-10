import { Injectable } from '@angular/core'
import { API_CONSTANTS } from '../../constants/apiUrlConstants'
import { map } from 'rxjs'
import { ApiService } from '../api/api.service'
import { ToastService } from '../toast/toast.service'
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
  ) {}

  enrollSession(id: any) {
    const config = {
      url: API_CONSTANTS.ENROLL_SESSION + id,
      payload: {},
    }
    return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toastService.showMessage(result.message, 'success')
        return result.result
      }),
    )
  }

  joinSession(id: any) {
    const config = {
      url: API_CONSTANTS.JOIN_SESSION + id,
      payload: {},
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        this.toastService.showMessage(result.message, 'success')
        window.open(result.result.link)
      }),
    )
  }
startSession(id: any){
  const config = {
    url: API_CONSTANTS.START_SESSION + id,
    payload: {},
  }
  return this.apiService.get(config).pipe(
    map((result: any) => {
      this.toastService.showMessage(result.message, 'success')
      window.open(result.result.link)
    }),
  )
}
  createSession(formData:any, id?: string) {
    const config = {
      url: id == null ? API_CONSTANTS.CREATE_SESSION : API_CONSTANTS.CREATE_SESSION + `/${id}`,
      payload: formData,
    }
    return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toastService.showMessage(result.message, 'success')
        return result.result;
      }),
    )
  }

  pastSession(obj:any){
    const config = {
      url:
        API_CONSTANTS.GET_SESSIONS_LIST +
        obj.page +
        '&limit=' +
        obj.limit +
        '&status=' +
        obj.status,
      payload: {},
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
       return result
      })
    )
  }
  upComingSession(obj:any){
    const config = {
      url:
        API_CONSTANTS.GET_SESSIONS_LIST +
        obj.page +
        "&status=published,live"+
        '&limit=' +
        obj.limit,
      payload: {},
    }
    return this.apiService.get(config).pipe(
      map((data: any) => {
        return data
      }),
    )
  }
  allSession(obj:any){
    const config={
      url: API_CONSTANTS.SESSIONS+ obj.enrolled+'&page='+ obj?.page + '&limit=' + obj?.limit,
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
       return result
      })
    )
  }
  getSessionDetailsAPI(id: any) {
    const config = {
      url: API_CONSTANTS.GET_SESSION_DETAILS + id
    }
    return this.apiService.get(config).pipe(
      map((data:any) => {
        let result = _.get(data, 'result');
        return result
      })
    )
  }
  mentorUpComingSession(obj:any){
    const config = {
      url: API_CONSTANTS.UPCOMING_SESSIONS +obj.id +'?&page='+ obj?.page + '&limit=' + obj?.limit,
      payload: {}
    };
    return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toastService.showMessage(result.message, 'success')
        return result;
      }),
    )
  }
  unEnrollSession(id: any){
    const config = {
      url: API_CONSTANTS.UNENROLL_SESSION + id,
      payload: {},
    }
    return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toastService.showMessage(result.message, 'success')
        return result.result
      }),
    )
  }
}
