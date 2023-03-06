import { Location } from "@angular/common";
import { Component, OnInit, ViewChild} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ProfileService } from "src/app/core/services/profile/profile.service";
import { CountdownTimerComponent } from "src/app/shared/components";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  @ViewChild("otpForm", { static: false }) otpFormRef: any;
  @ViewChild("timer") timerRef: CountdownTimerComponent;
  this: any;
  checked = false;
  timeLimit = 60;
  formData = {
    controls: [
      {
        name: "otp",
        label: "OTP",
        value: "",
        type: "tel",
        placeHolder: "Enter OTP",
        errorMessage: "Please enter valid OTP",
        validators: {
          required: true,
        },
      },
    ],
  };
  resetPasswordData : any;
  state: any;
  enableResendOtp: boolean = false;
  forgotPasswordData: any;
  otp: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private location: Location

  ) {
    if(!this.router.getCurrentNavigation()?.extras.state){
      this.location.back();
    }
    this.state = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {}

  async onSubmit() {
    this['state']['formData']['otp'] = this.otpFormRef.myForm.value.otp;
    const that: any = this;
    that[this.state.service][this.state.method](this.state.formData).subscribe((response: any) => {
      this.router.navigate([this.state.redirectUrl])
    })
  }
  
  async resendOTP() {
    this.timerRef.startCountdown();
    this.enableResendOtp = false;
    if(this.state.type == "signup"){
      this.profileService.registrationOtp(this.state.formData).subscribe((response => {
      }))
    }else{
      this.profileService.generateOtp({ email: this.state.formData.email, password: this.state.formData.password})
      .subscribe((response => {
      }))
    }
  }
  timerEvent(){
    this.enableResendOtp = true
  }
}