import { Component, OnInit, ViewChild } from '@angular/core';
import { FormService } from 'src/app/core/services/form/form.service';
import { HELP } from 'src/app/core/constants/formConstant';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { map } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Location} from '@angular/common';
import { Router } from '@angular/router';
import { ExitPopupComponent } from 'src/app/shared/components/exit-popup/exit-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/core/services/profile/profile.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})

export class HelpComponent implements OnInit {
  @ViewChild('help') help: DynamicFormComponent;
  userAmgent:any 
  userAgentDetails:any
  formData: any
  browserInfo:any
  dropDownData: any;
  selectedOption: any;
  selectedValue: any;
  message:any = ""
  userDetails:any;

  constructor(private form: FormService, private apiService: ApiService, private deviceService: DeviceDetectorService, private toast: ToastService,private location:Location,private router: Router,private dialog: MatDialog,private profileService: ProfileService) { }
 
  ngOnInit(): void {
    this.getFormDetails()
    this.browserInfo = this.deviceService.getDeviceInfo();
    this.profileService.profileDetails().then((userDetails) => {
      this.userDetails = userDetails;
    }) 
  }

  getFormDetails(){
    this.form.getForm(HELP).subscribe((form)=>{
      this.dropDownData = form.fields.forms;
      this.selectedOption = form.fields?.forms[0]?.name;
      this.message = (this.userDetails.isAMentor)?form.fields?.forms[0]?.menterMessage:form.fields?.forms[0]?.menteeMessage;
    }) 
  }

  onSubmit(type:any){
    let description = this.help.myForm.value.description ? this.help.myForm.value.description : type
      let reportData = {
        "description": description,
        "metaData":{
          "requestType":type,
          "browserName":this.browserInfo.browser,
          "browserVersion":this.browserInfo.browser_version
        }

      }
      if(type == 'Request to delete my account'){
        let dialogRef = this.dialog.open(ExitPopupComponent, {
          data: {
            header: "DELETE_ACCOUNT",
            label: "DELETE_ACCOUNT_LABEL",
            confirmButton: "YES",
            cancelButton: 'NO'
          }
        });
        const result = dialogRef.componentInstance.buttonClick.subscribe(()=> {
          this.reportIssue(reportData).subscribe((result) =>{
            this.router.navigate([`/${"home"}`], {replaceUrl: true})
           })
      })
      }else{
        this.reportIssue(reportData).subscribe((result) =>{
          this.router.navigate([`/${"home"}`], {replaceUrl: true})
         })
      }
 
     
  }

  reportIssue(data:any){
    let config = {
      url: API_CONSTANTS.REPORT_ISSUE,
      payload:data
    }
     return this.apiService.post(config).pipe(
      map((result: any) => {
        this.toast.showMessage(result.message, "success")
        return result
      }),
    )
  }

  clickOptions(option:any){
    this.selectedValue = option.value;
    this.selectedOption = option?.name;
    this.message = (this.userDetails.isAMentor) ? option?.menterMessage : option?.menteeMessage;
  }
}
