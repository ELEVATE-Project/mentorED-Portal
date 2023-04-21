import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { localKeys } from '../constants/localStorage.keys';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateGuard implements CanActivate {

  constructor(private router: Router, private localStorage: LocalStorageService, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      if(this.userService.token){
        return true
      } else {
        return this.localStorage.getLocalData(localKeys.TOKEN).then((token: any) => {
          if(token){
            return true
          } else {
            this.router.navigate(['/auth/login'])
            return false
          }
        })
      }
    }
}
