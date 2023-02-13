import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { FlexLayoutModule } from '@angular/flex-layout'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';

import { MatCardModule } from '@angular/material/card';
import { OtpComponent } from './otp/otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RoleSelectionComponent,
    OtpComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    SharedModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatDividerModule
  ]
})
export class AuthModule { }
