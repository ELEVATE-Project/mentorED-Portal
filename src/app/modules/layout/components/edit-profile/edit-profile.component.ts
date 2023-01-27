import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { EDIT_PROFILE_FORM } from 'src/app/core/constants/formConstant';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import { ApiService } from 'src/app/core/services';
import { FormService } from 'src/app/core/services/form/form.service';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { DynamicFormComponent } from 'src/app/shared';
import { ExitPopupComponent } from 'src/app/shared/components/exit-popup/exit-popup.component';
import { CanLeave } from '../../../../core/interfaces/canLeave';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, CanLeave {
  @ViewChild('editProfile') editProfile: DynamicFormComponent;
  imgData = {
    type: 'profile',
    image: '',
    isUploaded: true
  }
  path: any;
  localImage: any;
  public formData: any;
  showForm: any = false;
  type = 'profile'
  uiConfig = {
    appearance: 'fill',
    floatLabel: 'always'
  }
  isSaved: any = false;
  constructor(private formService: FormService, private profileService: ProfileService, private localStorage: LocalStorageService, private apiService: ApiService, private http: HttpClient, private changeDetRef: ChangeDetectorRef, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.formService.getForm(EDIT_PROFILE_FORM).subscribe((form) => {
      this.formData = form  
      this.localStorage.getLocalData(localKeys.USER_DETAILS).then((user) => {
        if (user) {
          this.imgData.image = (user.image) ? user.image : '';
          this.preFillData(JSON.parse(user));
          this.changeDetRef.detectChanges();
        }
      })
    })
  }
  @HostListener('window:beforeunload')
 canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isSaved && this.editProfile.myForm.dirty || (!this.imgData.isUploaded) ) {
      return window.confirm("Are you sure you want to exit? your data will not be saved.");
    } else {
      return true;
    }
  }
  onSubmit() {
    this.isSaved = true;
    if (this.editProfile.myForm.valid) {
      if (this.imgData.image && !this.imgData.isUploaded) {
        this.getImageUploadUrl(this.localImage).subscribe()
      } else {
        this.profileService.profileUpdate(this.editProfile.myForm.value).subscribe();
      }
    }else{
      let fillRequiredField = 'PLEASE_FILL_REQUIRED_FIELDS'
      this.toastService.showMessage(fillRequiredField, 'error')
    }
  }
  getImageUploadUrl(file: any) {
    let config = {
      url: API_CONSTANTS.GET_IMAGE_UPLOAD_URL + file.name.replaceAll(/[^A-Z0-9]+/ig, "_").toLowerCase()
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        return this.upload(file, result.result).subscribe(() => {
          this.imgData.isUploaded = true;
          this.editProfile.myForm.value.image = result.result.filePath
          this.onSubmit();
        })
      }))
  }


  upload(file: any, path: any) {
    var options = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    return this.http.put(path.signedUrl, file, options);
  }

  imageEvent(event: any) {
    if(event){
      this.localImage = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (file: any) => {
        this.imgData.image = file.target.result
        this.imgData.isUploaded = false;
      }
      this.toastService.showMessage("IMAGE_ADDED_SUCCESSFULLY", "success")
      
    } else {
      this.localImage = this.imgData.image = '';
      this.imgData.isUploaded = true;
      this.toastService.showMessage("IMAGE_REMOVED_SUCCESSFULLY", "success")
    }
  }

  preFillData(existingData: any) {
    this.imgData.image = (existingData['image']) ? existingData['image'] : '';
    for (let i = 0; i < this.formData.controls.length; i++) {
      this.formData.controls[i].value = existingData[this.formData.controls[i].name];
      this.formData.controls[i].options = _.unionBy(this.formData.controls[i].options, this.formData.controls[i].value, 'value');
    }
    this.showForm = true;
  }
}
