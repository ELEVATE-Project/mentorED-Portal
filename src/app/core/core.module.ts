import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[CanDeactivateGuard]
 
})
export class CoreModule { }