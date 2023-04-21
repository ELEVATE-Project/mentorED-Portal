import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private db: NgxIndexedDBService) { }

  add(storeName:string, data:any) {
    return this.db.add(storeName, data).pipe(
      map((form) => {
        return form
      }))
  }

  getById(storeName:string, id:string) {
    return this.db.getByID(storeName, id).pipe(
      map((form:any)=>{
        if(form)
          return form
      })
    )
  }

  getAll(storeName:string) {
    return this.db.getAll(storeName).pipe(
      map((form:any)=>{
        if(form)
          return form
      })
    )
  }

  update(storeName:string, formData:any) {
    return this.db.update(storeName, formData).pipe(
      map((storeData)=>{
        return storeData
      })
    )
  }

  clear(storeName:string) {
    return this.db.clear(storeName).pipe(
      map((isCleared)=>{
        return isCleared
      })
    )
  }

  delete(storeName:string) {
    return this.db.deleteObjectStore(storeName).pipe(
      map((isCleared)=>{
        return isCleared
      }))
  }
}
