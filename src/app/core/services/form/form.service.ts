import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../constants/apiUrlConstants';
import { ApiService } from '../api/api.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { DbService } from '../db/db.service';
import * as _ from 'lodash';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { localKeys } from '../../constants/localStorage.keys';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private apiService: ApiService, private dbService: DbService, private localStorage: LocalStorageService) { }

  // Form versions
  getFormVersionsFromAPI(localVersions: any) {
    if (localVersions) {
      const config = {
        url: API_CONSTANTS.FORM_READ,
        payload: {},
      };
      return this.apiService.post(config).pipe(
        map((result: any) => {
          return this.checkFormVersionsWithLocal(localVersions, result.result)
        })
      )
    } else {
      return null
    }
  }

  // check form versions
  checkFormVersionsWithLocal(localVersions: any, formVersions: any) {
    if(!_.isEqual(localVersions,formVersions)){
      this.dbService.clear('forms').subscribe();
      return false
    }
    return true
  }

  // Checking form in local
  getForm(formBody: any): Observable<any> {
    return this.dbService.getById('forms', formBody.type)
      .pipe(
        switchMap((form: any) => {
          if (!form) {
            return this.getFormFromServer(formBody).pipe(
              map((form) => {
                return form
              }))
          }
          return of(form);
        })
      );
  }

  // Getting form from api
  getFormFromServer(formBody: any) {
    const config = {
      url: API_CONSTANTS.FORM_READ,
      payload: formBody,
    };
    return this.apiService.post(config).pipe(
      map((result: any) => {
        let formData = _.pick(result, 'meta.formsVersion', 'result.data.fields.controls')
        this.addFormToLocal(formBody.type, formData);
        return result.result.data.fields;
      })
    )
  }

  // Storing form in local
  addFormToLocal(id: string, formData: any): any {
    this.dbService.add('forms', { id: id, controls: formData.result.data.fields.controls }).subscribe((form) => {
      this.localStorage.saveLocalData(localKeys.FORM_VERSIONS, JSON.stringify(formData.meta.formsVersion))
    })
  }
}
