import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { concat, delay, of } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {

  @Output() countTimer = new EventEmitter()
  @Input() timeLimit = 60;
  minutes: any = 0;
  seconds: any = 0

  constructor() { }

  ngOnInit(): void {
    this.startCountdown()
  }

  startCountdown() {
    const countdown = [];
    for (let i = this.timeLimit; i >= 0; i--) {
      countdown.push(i);
    }
    concat(...countdown.map(
      x => of(x).pipe(
        delay(1000)
      )
    )).subscribe(x => {
      this.minutes = Math.floor(x / 60);
      this.seconds = x % 60;
      if(x == 0){
        this.countTimer.emit()
      }
    });
  }

}
