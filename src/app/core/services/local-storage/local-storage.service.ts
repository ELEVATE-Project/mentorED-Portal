import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public saveLocalData(key: string, value: string): Promise<any> {
    return new Promise((resolve,reject) => {
      let data = null;
      if (isPlatformBrowser(this.platformId)) {
        data = localStorage.setItem(key, value) 
      }
      resolve(data)
    })
    }
    
    public getLocalData(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        let data = null;
        if (isPlatformBrowser(this.platformId)) {
          data = localStorage.getItem(key);
        }
        resolve(data)
      })
    }
    
    public removeLocalData(key: Array<string>): Promise<any> {
      return new Promise((resolve, reject) => {
        for (const keys of key) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(keys);
          }
        }
        resolve(key)
      })
    }
    
    public clearData() {
    localStorage.clear();
    }
    
}
