import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: "app-role-selection-card",
  templateUrl: "./role-selection-card.component.html",
  styleUrls: ["./role-selection-card.component.scss"],
})
export class RoleSelectionCardComponent implements OnInit {
  @Input() role: any
  @Input() isSelected:any
  @Output() cardOneSelected = new EventEmitter()
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  cardSelected(role: any) {
    this.cardOneSelected.emit(role)
  }
  
}
