import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { CREATE_SESSION_FORM } from 'src/app/core/constants/formConstant';
import { ApiService } from 'src/app/core/services';
import { FormService } from 'src/app/core/services/form/form.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { DynamicFormComponent } from 'src/app/shared';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit {
  @ViewChild('createSession') createSession: DynamicFormComponent;
  imgData = {
    type: 'session',
    image: '',
    isUploaded: true
  }
  defaultImageArray = []
  formData: any;
  localImage: any;

  constructor(private form: FormService, private apiService: ApiService, private http: HttpClient, private sessionService: SessionService, private location: Location) { }

  ngOnInit(): void {
    this.form.getForm(CREATE_SESSION_FORM).subscribe((form)=>{
      this.formData = form;
    })
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
    } else {
      this.localImage = this.imgData.image = '';
      this.imgData.isUploaded = true;
    }
  }

  onSubmit() {
    if (this.createSession.myForm.valid) {
      if (this.imgData.image && !this.imgData.isUploaded) {
        this.getImageUploadUrl(this.localImage).subscribe()
      } else {
        this.sessionService.createSession(this.createSession.myForm.value).subscribe((result)=>{
          this.location.back();
        });
      }
    }
  }
  getImageUploadUrl(file: any) {
    let config = {
      url: API_CONSTANTS.GET_IMAGE_UPLOAD_URL + file.name
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        return this.upload(file, result.result).subscribe(() => {
          this.imgData.isUploaded = true;
          this.createSession.myForm.value.append('image', result.result.signedUrl)
          this.onSubmit();
        })
      }))
  }
  upload(file: any, path: any) {
    const imageForm = new FormData();
    imageForm.append('image', file);
    return this.http.put(path.signedUrl, imageForm);
  }
}
