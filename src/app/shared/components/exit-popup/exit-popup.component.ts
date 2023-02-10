import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-popup',
  templateUrl: './exit-popup.component.html',
  styleUrls: ['./exit-popup.component.scss']
})
export class ExitPopupComponent implements OnInit {

  @Output() buttonClick = new EventEmitter()

  constructor(public dialogRef: MatDialogRef<ExitPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onUnEnroll() {
    this.buttonClick.emit()
  }
}
