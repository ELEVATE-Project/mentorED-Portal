import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from "@angular/material/form-field";
import { 
  DynamicFormComponent,
  InputChipComponent, 
  SessionCardComponent, 
  StarRatingComponent, 
  RoleSelectionCardComponent, 
  CountdownTimerComponent, 
  ProfileHeaderComponent
} from './components/index';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { MatMenuModule} from '@angular/material/menu';
import { GenericDetailsComponent } from './components/generic-details/generic-details.component';
import { InputDialogueBoxComponent } from './components/dialogue-box/dialogue-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';


@NgModule({
  declarations: [
    DynamicFormComponent,
    InputChipComponent,
    SessionCardComponent,
    StarRatingComponent,
    RoleSelectionCardComponent,
    CountdownTimerComponent,
    NoDataFoundComponent,
    GenericDetailsComponent,
    ProfileHeaderComponent,
    InputDialogueBoxComponent,
    // ExitPopupComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,
    MatToolbarModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatBadgeModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    DynamicFormComponent,
    MatChipsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    SessionCardComponent,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InputChipComponent,
    StarRatingComponent,
    FlexLayoutModule,
    RoleSelectionCardComponent,
    CountdownTimerComponent,
    MatToolbarModule,
    FormsModule,
    NoDataFoundComponent,
    MatMenuModule,
    GenericDetailsComponent,
    ProfileHeaderComponent,
    MatDialogModule,
    MatBadgeModule
  ]
})
export class SharedModule { }