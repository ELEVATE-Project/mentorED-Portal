import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs' 

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private title = new BehaviorSubject<string>('');
  newTitle$ = this.title.asObservable();
  private buttonConfig = new BehaviorSubject<object>({});
  newButtonConfig$ = this.buttonConfig.asObservable();

  constructor() { }

  editTItle(title:string){
    this.title.next(title)
  }
  editButtonConfig(buttonConfig:object){
    this.buttonConfig.next(buttonConfig)
  }
}
