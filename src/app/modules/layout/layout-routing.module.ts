import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CreatedSessionsComponent } from './components/created-sessions/created-sessions.component'
import { FaqComponent } from './components/faq/faq.component'
import { MentorDirectoryComponent } from './components/mentor-directory/mentor-directory.component'
import { SessionListingComponent } from './components/session-listing/session-listing.component'
import { LayoutComponent } from './layout.component'
import { PrivateGuard } from '../../core/guards/private.guard'
import { ProfilePageComponent } from './components/profile-page/profile-page.component'
import { CreateSessionComponent } from './components/create-session/create-session.component'
import { EditProfileComponent } from './components/edit-profile/edit-profile.component'
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [PrivateGuard],
    children: [
      {
        path: 'home',
        component: SessionListingComponent,
        data: {showSearchbar: true},
      },

      {
        path: 'enrolled-sessions',
        component: SessionListingComponent,
        data: {showSearchbar: true},
      },
      {
        path: 'created-sessions',
        component: CreatedSessionsComponent,
        data: {showSearchbar: true},
      },
      {
        path: 'mentor-directory',
        component: MentorDirectoryComponent,
        data: {showSearchbar: true},
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {title: 'FAQ'}
      },
      { path: 'profile',
        component: ProfilePageComponent,
        data: {title: 'MY_PROFILE'}
      },
      {
        path: 'create-session',
        component: CreateSessionComponent,
        data: {title: 'CREATE_NEW_SESSION'},
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'edit-profile',
        component: EditProfileComponent,
        data: {title: 'EDIT_YOUR_PROFILE'},
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
