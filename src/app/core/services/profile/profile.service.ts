import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { map } from "rxjs";
import { API_CONSTANTS } from "../../constants/apiUrlConstants";
import { localKeys } from "../../constants/localStorage.keys";
import { ApiService } from "../api/api.service";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { ToastService } from "../toast/toast.service";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private localStorage: LocalStorageService,
    private apiService: ApiService,
    private userService: UserService,
    private _location: Location,
    private toastService: ToastService,
    private toast: ToastService
  ) {}

  async profileDetails(): Promise<any> {
    return new Promise((resolve) => {
      try {
        this.localStorage
          .getLocalData(localKeys.USER_DETAILS)
          .then(async (data) => {
            if (data) {
              resolve(data);
            } else {
              var res = await this.getProfileDetailsAPI();
              await this.localStorage.saveLocalData(
                localKeys.USER_DETAILS,
                JSON.stringify(res)
              );
              data = _.get(data, "user");
              resolve(data);
            }
          });
      } catch (error) {}
    });
  }

  getProfileDetailsAPI() {
    const config = {
      url: API_CONSTANTS.PROFILE_DETAILS,
      payload: {},
    };
    return this.apiService.get(config).pipe(
      map((result: any) => {
        let data = _.get(result, "result");
        this.localStorage.saveLocalData(
          localKeys.USER_DETAILS,
          JSON.stringify(data)
        );
        return data;
      })
    );
  }

  profileUpdate(formData: any) {
    const config = {
      url: API_CONSTANTS.PROFILE_UPDATE,
      payload: formData,
    };
    return this.apiService.post(config).pipe(
      map(async (response: any) => {
        let profileData = await this.getProfileDetailsAPI();
        await this.localStorage.saveLocalData(
          localKeys.USER_DETAILS,
          JSON.stringify(profileData)
        );
        this.userService.userEvent.next(profileData);
        this._location.back();
        return profileData;
      })
    );
  }
  registrationOtp(formData: any) {
    const config = {
      url: API_CONSTANTS.REGISTRATION_OTP,
      payload: formData,
    };
    return this.apiService.post(config).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
  generateOtp(formData: any) {
    const config = {
      url: API_CONSTANTS.GENERATE_OTP,
      payload: formData,
    };
    return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toast.showMessage(result.message, "success");
        return result;
      })
    );
  }
}
