import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-details',
  templateUrl: './generic-details.component.html',
  styleUrls: ['./generic-details.component.scss'],
})
export class GenericDetailsComponent implements OnInit {
  @Input() details: any
  @Input() layoutAlign:any
  selectedPage:any;
  constructor(private translate:TranslateService, private router:Router) {
    this.selectedPage = router.url
  }
  public isArray(arr:any ) {
    return Array.isArray(arr)
 }
  ngOnInit(): void {}
  
}
