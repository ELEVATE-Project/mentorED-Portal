import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharePopupComponent } from 'src/app/shared/components/share-popup/share-popup.component';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(public dialog: MatDialog) { }
  shareButton(url:any) {
    this.dialog.open(SharePopupComponent, {
      data: { defaultValue: url},
       });
  }
}
