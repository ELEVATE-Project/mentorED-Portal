import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNavigatorComponent } from './page-navigator/page-navigator.component';
import { LayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule} from '@angular/material/select';
import { CoreModule, FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core'; 


import { MatListModule } from '@angular/material/list';
import { SessionListingComponent } from './components/session-listing/session-listing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatedSessionsComponent } from './components/created-sessions/created-sessions.component';
import { MentorDirectoryComponent } from './components/mentor-directory/mentor-directory.component';
import { FaqComponent } from './components/faq/faq.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { MatCardModule } from '@angular/material/card';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ExitPopupComponent } from '../../shared/components/exit-popup/exit-popup.component';
import { CreateSessionComponent } from './components/create-session/create-session.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MentorProfileComponent } from './components/mentor-profile/mentor-profile.component';
import { SlReportsLibraryModule} from '@shikshalokam/sl-reports-library'
import { SessionDetailComponent } from './components/session-detail/session-detail.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    PageNavigatorComponent,
    SessionListingComponent,
    CreatedSessionsComponent,
    MentorDirectoryComponent,
    FaqComponent,
    ProfilePageComponent,
    EditProfileComponent,
    ImageUploadComponent,
    ExitPopupComponent,
    CreateSessionComponent,
    EditProfileComponent,
    LogoutComponent,
    DashboardComponent,
    MentorProfileComponent,
    SessionDetailComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    FlexLayoutModule,
    MatButtonModule,
    TranslateModule,
    CoreModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    SharedModule,
    MatSidenavModule,
    MatCardModule,
    MatDialogModule,
    MatCardModule,
    SlReportsLibraryModule
  ]


})
export class LayoutModule { }
