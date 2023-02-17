import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharePopupComponent } from 'src/app/shared/components/share-popup/share-popup.component';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(public dialog: MatDialog, private pLocation:PlatformLocation) { }
  shareButton(url = (this.pLocation as any).location.href) {
    this.dialog.open(SharePopupComponent, {
      data: { defaultValue: url},
       });
  }
}
