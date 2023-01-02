import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() imgData: any;
  @Output() imageEvent = new EventEmitter();
  defaultImg: any;

  constructor() { }

  ngOnInit(): void {
    switch (this.imgData.type) {
      case 'profile':
        this.defaultImg = '/assets/images/user-circle-add.svg';
        break;

      case 'session':
        this.defaultImg = '/assets/images/default-session-upload.svg'
    }
  }
  imageUpload(event: Event): void {
    this.imageEvent.emit(event)
  }
  imageRemove(){
    this.imageEvent.emit()
  }
}
