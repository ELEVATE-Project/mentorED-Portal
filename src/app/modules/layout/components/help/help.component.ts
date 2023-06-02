import { Component, OnInit, ViewChild } from '@angular/core';
import { truncate } from 'lodash-es';
import * as Bowser from "bowser";
import { FormService } from 'src/app/core/services/form/form.service';
import { HELP } from 'src/app/core/constants/formConstant';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { map } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Location} from '@angular/common';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})

export class HelpComponent implements OnInit {
  @ViewChild('help') help: DynamicFormComponent;
  userAgent:any 
  userAgentDetails:any
  formData: any
  browserInfo:any

  constructor(private form: FormService, private apiService: ApiService, private deviceService: DeviceDetectorService, private toast: ToastService,private location:Location) { }
 
  ngOnInit(): void {
    this.getFormDetails()
    this.browserInfo = this.deviceService.getDeviceInfo();
  }

  getFormDetails(){
    this.form.getForm(HELP).subscribe((form)=>{
      this.formData = form.fields;
    }) 
  }

  onSubmit(){
      let data = {
        "description": this.help.myForm.value.description,
        "metaData":{
          "browserName":this.browserInfo.browser,
          "browserVersion":this.browserInfo.browser_version
        }

      }
 this.reportIssue(data).subscribe((result) =>{
  this.toast.showMessage(result.message, "success")
  this.location.back()
 })
     
  }

  reportIssue(data:any){
    let config = {
      url: API_CONSTANTS.REPORT_ISSUE,
      payload:data
    }
     return this.apiService.post(config).pipe(
      map((result: any) => {
        return result
      }),
    )
  }
}
