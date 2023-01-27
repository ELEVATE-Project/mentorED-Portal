import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-card',
  templateUrl: './mentor-card.component.html',
  styleUrls: ['./mentor-card.component.scss']
})
export class MentorCardComponent implements OnInit {
  @Input() cardData: any;
  @Output() onClickEvent = new EventEmitter();
  constructor(private router: Router) { }

  ngOnInit(): void {}
  onClickCiewProfile(mentor:any){
    let value = {
      data: mentor,
      type: 'cardSelect',
    }
    this.onClickEvent.emit(value)
  }
}
