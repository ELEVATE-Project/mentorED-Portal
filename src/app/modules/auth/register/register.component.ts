import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { DynamicFormComponent } from 'src/app/shared/components';
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('signup') signup: DynamicFormComponent;
  formData = {
    controls: [
      {
        name: 'name',
        label: 'Name',
        value: '',
        class: 'ion-margin',
        type: 'text',
        placeHolder: 'Enter full name',
        position: 'floating',
        errorMessage:'This field can only contain alphabets',
        validators: {
          required: true,
          pattern:'^[a-zA-Z ]*$',
        },
      },
      {
        name: 'email',
        label: 'Email ID',
        value: '',
        placeHolder: 'yourname@email.com',
        type: 'email',
        errorMessage:'Please enter valid email ID',
        validators: {
          required: true,
          pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
        },
      },
      {
        name: 'password',
        label: 'Password',
        value: '',
        placeHolder: 'Enter password',
        type: 'password',
        errorMessage:'Please enter password with minimum 8 characters',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&~*^()\\-`.+,/\"]*$",
        },
      },
      {
        name: 'cPassword',
        label: 'Confirm password',
        value: '',
        placeHolder: 'Enter password again',
        type: 'password',
        errorMessage:'Please enter same password as above',
        validators: {
          required: true,
          minLength: 8,
          pattern: "^[a-zA-Z0-9!@#%$&~*^()\\-`.+,/\"]*$",
        },
      },
    ]
  }
  secretCodeControl = {
    name: 'secretCode',
    label: 'Secret code',
    value: '',
    placeHolder: 'Enter valid secret code',
    type: 'secretCode',
    errorMessage:'Please refer to the on-boarding email for your secret code',
    toastMsg: 'SECRET_CODE_TOAST_MESSAGE',
    toastIcon: 'info',
    validators: {
      required: true,
      minLength: 4,
      pattern: ''
    },
  };
  selectedRole: any;
  isAMentor: boolean;
  secretCode: string = "";

  constructor(
    private routerParms: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private toastService: ToastService,
    private translate: TranslateService,) { 
    routerParms.queryParams.subscribe(data =>{
      this.selectedRole = data['selectedRole'];
      if(this.selectedRole == "MENTOR"){
        this.formData.controls.push(this.secretCodeControl);
        this.isAMentor = true;
      }
    })
  }

  ngOnInit(): void {
  }
  onSignUp(){
    this.signup.onSubmit();
    this.createUser();
  }
  createUser(){
    let formJson = this.signup.myForm.value;
    formJson.isAMentor = this.isAMentor ? this.isAMentor : false;
    if (this.signup.myForm.valid) {
      if (_.isEqual(formJson.password, formJson.cPassword)) {
        this.profileService.registrationOtp(formJson).subscribe((response: any) => {
          if (response) {
            this.router.navigate(['/auth/otp'], { state: { type: "signup", formData: formJson, service: 'authService', redirectUrl: '/home', method: 'createAccount' } });
          }
        })
      } else {
        this.toastService.showMessage(this.translate.get('PASSWORD_NOT_MATCH'), 'warning')
      }
    }
  }
}