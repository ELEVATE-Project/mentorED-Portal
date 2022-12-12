import { Location } from "@angular/common";
import { Component, OnInit, ViewChild} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { LocalStorageService } from "src/app/core/services/local-storage/local-storage.service";
import { ProfileService } from "src/app/core/services/profile/profile.service";
import { ToastService } from "src/app/core/services/toast/toast.service";
import { CountdownTimerComponent } from "src/app/shared/components";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  @ViewChild("otpForm", { static: false }) otpFormRef: any;
  @ViewChild("timer") timerRef: CountdownTimerComponent;

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
        errorMessage: "Please enter the OTP",
        validators: {
          required: true,
        },
      },
    ],
  };
  resetPasswordData : any;
  signupData: any;
  enableResendOtp: boolean = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private toast: ToastService,
    private location: Location

  ) {
    if(!this.router.getCurrentNavigation()?.extras.state){
      this.location.back();
    }
    this.signupData = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {}

  async onSubmit() {
    this.signupData.formData.otp = this.otpFormRef.myForm.value.otp;
    (await this.authService.createAccount(this.signupData.formData)).subscribe(async (response: any) => {
      this.router.navigate(['/home']);
        })
  }
  
  async resendOTP() {
    this.timerRef.startCountdown();
    this.enableResendOtp = false;
    if(this.signupData.type == "signup"){
      this.profileService.registrationOtp(this.signupData.formData).subscribe((response => {
        this.toast.showMessage(response.message,"success")
      }))
    }else{
      this.profileService.generateOtp({ email: this.signupData.formData.email, password:  this.signupData.formData.password})
      .subscribe((response => {
        this.toast.showMessage(response.message,"success")
      }))
    }
  }
}
