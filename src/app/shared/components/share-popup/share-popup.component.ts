import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss']
})
export class SharePopupComponent implements OnInit {
  copyLink: any = 'COPY_LINK'
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { heading:any, defaultValue: any }, public dialogRef: MatDialogRef<SharePopupComponent>
  ) { }

  ngOnInit(): void {
  }
  onClickCancel() {
    this.dialogRef.close();
  }
  copyToClipBoard() {
    navigator.clipboard.writeText(this.data.defaultValue).then(() => {
      this.copyLink = 'COPIED_LINK'
    }, () => {
      console.error('Failed to copy');
    });
  }
}
