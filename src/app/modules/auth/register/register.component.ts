import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
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
        errorMessage:'Enter your full name',
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
          pattern: '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
        },
      },
      {
        name: 'password',
        label: 'Password',
        value: '',
        placeHolder: 'Enter password',
        type: 'password',
        errorMessage:'Please enter password',
        validators: {
          required: true
        },
      },
      {
        name: 'cPassword',
        label: 'Confirm Password',
        value: '',
        placeHolder: 'Enter password again',
        type: 'password',
        errorMessage:'Please enter password',
        validators: {
          required: true
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
    errorMessage:'Please enter secret code',
    validators: {
      required: true,
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
    private translate: TranslateService) { 
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
  async createUser(){
    let formJson = this.signup.myForm.value;
    formJson.isAMentor = this.isAMentor ? this.isAMentor : false;
    if (_.isEqual(formJson.password, formJson.cPassword)) {

      this.profileService.registrationOtp(formJson).subscribe(async (response: any) => {
        if(response){
          this.toastService.showMessage(response.message, 'success');
          this.router.navigate(['/auth/otp'], { state: { type: "signup", formData: formJson } });
        }
      })
    } else {
      this.toastService.showMessage(this.translate.instant("PASSWORD_NOT_MATCH"), 'danger');
    }
  }

}
