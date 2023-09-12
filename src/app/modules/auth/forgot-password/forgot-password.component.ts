import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  [x: string]: any;
  @ViewChild('forgotPassword') forgotPassword: DynamicFormComponent;

  

  formData: any = {
    controls: [
      {
        name: 'email',
        label: 'Email ID',
        value: '',
        type: 'email',
        placeHolder: 'yourname@email.com',
        errorMessage: 'Enter valid Email Id',
        validators: {
          required: true,
          pattern: '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
        },
      },
      {
        name: 'password',
        label: 'New password',
        value: '',
        type: 'password',
        placeHolder: 'Enter new password',
        errorMessage: 'Enter minimum 8 characters',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&~*^()\\-`.+,/\"]*$"
        },
      },
      {
        name: 'cPassword',
        label: 'Confirm password',
        value: '',
        placeHolder: 'Enter password again',
        type: 'password',
        errorMessage: 'Enter minimum 8 characters',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&~*^()\\-`.+,/\"]*$",
        }
      }
    ]
  };

  constructor(private router: Router,
    private profileService: ProfileService,
    private toastService: ToastService,
    private translate: TranslateService) { }
  ngOnInit(): void { }


  resetPassword() {
    let formJson = this.forgotPassword.myForm.value;
    if (this.forgotPassword.myForm.valid) {
      if (_.isEqual(formJson.password, formJson.cPassword)) {
        this.profileService.generateOtp(formJson).subscribe((response: any) => {
          if (response) {
            this.router.navigate(['/auth/otp'], { state: { formData: formJson, service: 'profileService', redirectUrl: '/home', method: 'updatePassword' } });
          }
        })
      } else {
        this.toastService.showMessage(this.translate.get('PLEASE_ENTER_THE_SAME_PASSWORD'), 'warning')
      }
    }
  }
}