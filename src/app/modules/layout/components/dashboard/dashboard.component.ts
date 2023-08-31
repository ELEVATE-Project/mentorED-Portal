import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Chart } from 'chart.js/auto'
import { result } from 'lodash-es'
import { map } from 'rxjs'
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants'
import { localKeys } from 'src/app/core/constants/localStorage.keys'
import { ApiService } from 'src/app/core/services'
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service'
import { ProfileService } from 'src/app/core/services/profile/profile.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('selectDropdown') selectDropdown: any;
  public chart: any;
  segment: any = 'mentee'
  dataAvailable: any=true;
  isMentor: boolean = false
  selectedFilter = 'Weekly'
  buttonEnable = false
  selectedButton: any = 'MENTOR_LABEL'
  noData: any = { image : '/assets/images/no-data-available.png', 
  content:'CONDUCT_LIVE_SESSION_TO_FILL_SPACE'}
  filters: any = [
    {
      key: 'Weekly',
      value: 'WEEKLY',
    },
    {
      key: 'Monthly',
      value: 'MONTHLY',
    },
    {
      key: 'Quarterly',
      value: 'QUARTERLY',
    },
  ]
  buttonConfig: any = [
    { label: 'MENTOR_LABEL', value: 'mentor' },
    { label: 'MENTEE_LABEL', value: 'mentee' },
  ]
  loading: boolean = false
  chartData: any ;
  constructor(
    private translate: TranslateService,
    private profileService: ProfileService,
    private apiService: ApiService,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    document.addEventListener('scroll', () => {
      this.selectDropdown.close();
    })
    this.localStorage.getLocalData(localKeys.USER_DETAILS).then((user: any) => {
      this.segment = JSON.parse(user).isAMentor ? 'mentor' : this.segment
      this.isMentor = JSON.parse(user).isAMentor
      this.getReports().subscribe()
      this.noData.content = this.segment == 'mentee'
      ?  'ENROLL_FOR_SESSION_TO_FILL_SPACE'
      : 'CONDUCT_LIVE_SESSION_TO_FILL_SPACE'
    })
   
  }
  createChart() {
    this.dataAvailable = (this.chartData?.totalSessionCreated == 0 || this.chartData?.totalSessionEnrolled == 0) ? false : true
    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.segment === 'mentor' ? ['Total sessions created', 'Total sessions conducted',]:['Total sessions enrolled', 'Total sessions attended'],
	       datasets: [{
          label: 'Total',
          data: this.segment === 'mentor' ? [this.chartData.totalSessionCreated, this.chartData.totalsessionHosted]:[this.chartData.totalSessionEnrolled, this.chartData.totalsessionsAttended],
          backgroundColor: [
            '#ffdf00', '#7b7b7b'
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio:1.5,
        responsive: true,
      }

    });
  }

  getReports() {
    this.loading = true
    const url =
      this.segment === 'mentor'
        ? API_CONSTANTS.MENTOR_REPORTS
        : API_CONSTANTS.MENTEE_REPORTS
    const config = {
      url: url + this.selectedFilter.toUpperCase(),
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        this.chartData = result.result
        this.createChart()
      }),
    )
  }
  buttonClick(button: any) {
    this.selectedButton = button.label
    this.segment = button.value
    this.noData.content =
      button.value == 'mentor'
        ? 'CONDUCT_LIVE_SESSION_TO_FILL_SPACE'
        : 'ENROLL_FOR_SESSION_TO_FILL_SPACE'
    this.chart.destroy();
    this.dataAvailable = true;
    this.getReports().subscribe()
  }
  filterChangeHandler(event: any) {
    this.selectedFilter = event
    this.chart.destroy();
    this.dataAvailable = true;
    this.getReports().subscribe()
  }
}
