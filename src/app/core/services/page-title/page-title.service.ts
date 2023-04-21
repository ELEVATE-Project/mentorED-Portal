import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs' 

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private paginatorConfig = new BehaviorSubject<object>({});
  newButtonConfig$ = this.paginatorConfig.asObservable();

  constructor() { }
  
  editButtonConfig(paginatorConfig:object){
    this.paginatorConfig.next(paginatorConfig)
  }
}
