import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { map } from "rxjs";
import { API_CONSTANTS } from "../../constants/apiUrlConstants";
import { ApiService } from "../api/api.service";
import { ToastService } from "../toast/toast.service";
import { UserService } from "../user/user.service";
@Injectable({
  providedIn: 'root'
})
export class MentorService {

  constructor(private apiService: ApiService,
    private userService: UserService,
    private _location: Location,
    private toastService: ToastService,) { }

  getMentorDirectory(obj:any){
    const config = {
      url: API_CONSTANTS.MENTORS_DIRECTORY + obj?.page + '&limit=' + obj?.limit 
    };
    return this.apiService.get(config).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getMentorDetails(id:string){
    const config = {
      url: API_CONSTANTS.MENTOR_PROFILE_DETAILS + id
    };
    return this.apiService.post(config).pipe(
      map((result: any) => {
        return result.result;
      })
    );
    
  }
}
