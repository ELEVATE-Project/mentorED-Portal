import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() imgData: any;
  @Output() imageEvent = new EventEmitter();
  defaultImg: any;

  constructor(private toast: ToastService) { }

  ngOnInit(): void {
    switch (this.imgData.type) {
      case 'profile':
        this.defaultImg = '/assets/images/user-circle-add.svg';
        break;

      case 'session':
        this.defaultImg = '/assets/images/default-session-upload.svg'
    }
  }
  imageUpload(event: any): void {
    switch(event.target.files[0].type){
      case "image/png":
        this.imageEvent.emit(event);
        break;
      case "image/jpeg":
        this.imageEvent.emit(event);
        break;
      default:
        this.toast.showMessage("FORMAT_IS_WRONG", "error")
    }
  }
  imageRemove(){
    this.imageEvent.emit()
  }
}
