import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  durationInSeconds = 2;
  constructor(private _snackBar: MatSnackBar, private translate: TranslateService) { }

  showMessage(msg: any, type: any) {
    let texts: any;
    this.translate.get([msg]).subscribe(resp => {
      texts = resp;
    })
    this._snackBar.open((_.isEmpty(texts))?msg:texts[msg], '', {
      duration: 2000,
      verticalPosition: "top",
      panelClass: (type=="success")?"snack-bar-success":"snack-bar-danger"
    });
  }
}