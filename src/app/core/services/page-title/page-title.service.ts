import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs' 

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private buttonConfig = new BehaviorSubject<object>({});
  newButtonConfig$ = this.buttonConfig.asObservable();

  constructor() { }
  
  editButtonConfig(buttonConfig:object){
    this.buttonConfig.next(buttonConfig)
  }
}
