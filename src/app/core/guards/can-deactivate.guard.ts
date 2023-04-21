import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { CanLeave } from '../interfaces/canLeave';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanLeave> {
  canDeactivate(component: CanLeave, 
           route: ActivatedRouteSnapshot, 
           state: RouterStateSnapshot) {
     return component.canDeactivate();
  }
} 

  
