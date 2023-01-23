import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ApiService } from 'src/app/core/services';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';

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
        errorMessage: 'Please enter registered email ID',
        validators: {
          required: true,
          pattern: '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
        },
      },
      {
        name: 'password',
        label: 'Password',
        value: '',
        type: 'password',
        placeHolder: 'Enter new password',
        errorMessage: 'Please enter your new password',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&()\\-`.+,/\"]*$"
        },
      },
      {
        name: 'cPassword',
        label: 'Confirm password',
        value: '',
        placeHolder: 'Enter password again',
        type: 'password',
        errorMessage: 'Please enter same password as above',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&()\\-`.+,/\"]*$",
        }
      }
    ]
  };

  constructor(private router: Router,
    private profileService: ProfileService,
    private toastService: ToastService) { }
  ngOnInit(): void { }

  resetPassword() {
    let formJson = this.forgotPassword.myForm.value;
    if (this.forgotPassword.myForm.valid) {
      if (_.isEqual(formJson.password, formJson.cPassword)) {
        this.profileService.generateOtp(formJson).subscribe((response: any) => {
          if (response) {
            this.router.navigate(['/auth/otp'], { state: { type: "forgotPassword", formData: formJson } });
          }
        })
      } else {
        this.toastService.showMessage('Please enter the same password', 'warning');
      }
    }
  }
}
