import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  header: any;
  subHeader: any;
  isPhone: boolean;

  constructor(private responsive: BreakpointObserver, private router: Router) {
    router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(data => {
      let key = data.urlAfterRedirects.split('?')[0].split('/').pop()
      switch (key) {
        case 'login':
          this.header = "LOGIN_HEADER"
          this.subHeader = "LOGIN_SUB_HEADER"
          break;
        case 'register':
          this.header = "SIGNUP_HEADER"
          this.subHeader = "SIGNUP_SUB_HEADER"
          break;
        case 'role-selection':
          this.header = "CHOOSE_YOUR_ROLE"
          this.subHeader = "JOIN_THE_COMMUNITY"
          break;
        case 'otp':
          this.header = "VERIFY_ACCOUNT"
          this.subHeader = "OTP_SUB_TEXT"
          break;

        default:
          break;
      }
      this.responsive.observe(Breakpoints.Handset).subscribe(result => {
        this.isPhone = result.matches
      })
    })
  }
    ngOnInit(): void {}
  }
