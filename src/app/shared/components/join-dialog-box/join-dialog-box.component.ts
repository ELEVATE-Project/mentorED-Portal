import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-join-dialog-box',
  templateUrl: './join-dialog-box.component.html',
  styleUrls: ['./join-dialog-box.component.scss']
})
export class JoinDialogBoxComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private sessionService: SessionService,
  private toast: ToastService) { }
  ngOnInit(): void {
  }

  onClickJoin(){
    window.location.replace(this.data.result.link)
  }
  copyToClipBoard() {
    navigator.clipboard.writeText(this.data.sessionData.meetingInfo?.meta?.password).then(() => {
      this.toast.showMessage('Copied successfully.')
    },() => {
      console.error('Failed to copy');
    });
  }

}
