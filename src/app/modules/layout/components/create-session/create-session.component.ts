import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { API_CONSTANTS } from 'src/app/core/constants/apiUrlConstants';
import { CREATE_SESSION_FORM } from 'src/app/core/constants/formConstant';
import { CanLeave } from '../../../../core/interfaces/canLeave';
import { ApiService } from 'src/app/core/services';
import { FormService } from 'src/app/core/services/form/form.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { DynamicFormComponent } from 'src/app/shared';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ExitPopupComponent } from 'src/app/shared/components/exit-popup/exit-popup.component';
import { MatStepper } from '@angular/material/stepper';
import { PLATFORMS } from 'src/app/core/constants/formConstant';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit, CanLeave {
  @ViewChild('createSession') createSession: DynamicFormComponent;
  @ViewChild('platform') platform: DynamicFormComponent;
  @ViewChild('stepper') stepper: MatStepper;
  imgData = {
    type: 'session',
    image: '',
    isUploaded: true
  }
  defaultImageArray = []
  formData: any;
  localImage: any;
  isSaved: any = false;
  uiConfig = {
    appearance: 'fill',
    floatLabel: 'always'
  }
  sessionResult: any;
  isDropdownShown: any = false
  publishSession: any = true;
  sessionDetails: any;
  sessionId: any;
  meetinLinkIncludes:any;
  secondStepper:any = false;
  imageChanged: any = false;
  selectedLink: any;
  selectedHint:any;
  selectedValue:any
  firstStepperTitle:any;
  meetingPlatforms:any ;
  fromSessionDetails: any;
  private unsubscriber: Subject<void> = new Subject<void>();
  
  constructor(private form: FormService, private apiService: ApiService, private changeDetRef: ChangeDetectorRef, private http: HttpClient, private sessionService: SessionService, private location: Location, private toast: ToastService, private localStorage: LocalStorageService,
    private route: ActivatedRoute, private router: Router,
    private dialog: MatDialog) {
    this.sessionId = this.route.snapshot.paramMap.get('id')
    
  }
 
        
 
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isSaved && this.createSession.myForm.dirty || (this.imageChanged)) {
      let dialog = this.dialog.open(ExitPopupComponent, {
        data: {
          header: "Exit this page?",
          label: "Are you sure you want to exit? your data will not be saved.",
          confirmButton: "EXIT",
          cancelButton: 'CANCEL'
        }
      })
      return dialog.afterClosed().pipe(
        map(((res) => {
          return res
        }))
      )
    } else {
      return true;
    }
  }
  ngOnInit(): void {
    this.firstStepperTitle = (this.sessionId) ? "EDIT_SESSION":"CREATE_NEW_SESSION"
    this.route.queryParams.subscribe(
      params => {
        this.secondStepper = params['secondStepper']
        this.fromSessionDetails =params['from']
      }
    )
    if(this.sessionId){
      this.sessionDetailApi()
    }else {
      this.getFormDetails()
      this.getPlatformFormDetails();
    }
    
  }
  ngAfterViewInit() {
    if( this.secondStepper){
      this.stepper.selectedIndex = 1; 
    }
     
  }
  getFormDetails(){
    this.form.getForm(CREATE_SESSION_FORM).subscribe((form)=>{
      this.formData = form.fields;
      this.changeDetRef.detectChanges();
      if(this.sessionDetails){
        this.preFillData(this.sessionDetails);
        this.changeDetRef.detectChanges();
      }
    }) 
  }
  getPlatformFormDetails(){
    this.form.getForm(PLATFORMS).subscribe((form)=>{
      this.meetingPlatforms = form?.fields?.forms;
      if(this.sessionDetails.meetingInfo.platform == 'OFF' || !this.sessionId){
        this.selectedLink = form.fields?.forms[0]?.name;
        this.selectedHint = form.fields?.forms[0]?.hint;
      }
      this.changeDetRef.detectChanges();
    })
 }
 
  imageEvent(event: any) {
    if(event){
      this.localImage = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (file: any) => {
        this.imgData.image = file.target.result
        this.imgData.isUploaded = false;
        this.imageChanged = true
      }
      this.toast.showMessage("IMAGE_ADDED_SUCCESSFULLY", "success")
    } else {
      this.localImage = this.imgData.image = '';
      this.createSession.myForm.value.image = [];
      this.imgData.isUploaded = true;
      this.imageChanged = true
      this.toast.showMessage("IMAGE_REMOVED_SUCCESSFULLY", "success")
    }
  }

  onSubmit() {
    this.imageChanged = false;
    this.isSaved = true;
    if (this.createSession.myForm.valid) {
      if (this.imgData.image && !this.imgData.isUploaded) {
        this.getImageUploadUrl(this.localImage).subscribe()
      } else {
        const form = Object.assign({}, this.createSession.myForm.value);
        form.startDate = new Date(moment(form.startDate).seconds(0).toISOString()).getTime()/1000;
        form.endDate = new Date(moment(form.endDate).seconds(0).toISOString()).getTime()/1000;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        form.timeZone = timezone;
        this.createSession.myForm.markAsPristine();
        this.sessionService.createSession(form,this.sessionDetails?._id).subscribe((result)=>{
          this.sessionResult = result;
          this.secondStepper = true;
          if(result?._id){
            this.router.navigate([`/${"edit-session"}/${result?._id}`], {replaceUrl: true,queryParams:{ secondStepper:this.secondStepper}})
          }else{
            this.router.navigate([`/${"edit-session"}/${this.sessionId}`], {replaceUrl: true,queryParams:{ secondStepper:this.secondStepper}})
            this.stepper.next();
          }
        });
      }
    }
  }
  getImageUploadUrl(file: any) {
    let config = {
      url: API_CONSTANTS.GET_IMAGE_UPLOAD_URL + file.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
    }
    return this.apiService.get(config).pipe(
      map((result: any) => {
        return this.upload(file, result.result).subscribe(() => {
          this.imgData.isUploaded = true;
          this.createSession.myForm.value.image = result.result.filePath;
          this.onSubmit();
        })
      }))
  }
  upload(file: any, path: any) {
    var options = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    return this.http.put(path.signedUrl, file);
  }
  sessionDetailApi(){
    this.sessionService.getSessionDetailsAPI(this.sessionId).subscribe((response: any) =>{
      this.sessionDetails = response;
      this.getPlatformFormDetails();
      this.getFormDetails();
    })
  }
  preFillData(existingData: any) {
    this.imgData.image = (existingData['image'][0]) ? existingData['image'][0] : '';
    for(let j=0;j<this?.meetingPlatforms.length;j++){
     
      if( existingData?.meetingInfo?.platform == this?.meetingPlatforms[j].name){
        this.selectedLink = this?.meetingPlatforms[j].name;
        this.selectedHint = this?.meetingPlatforms[j].hint;
        let link = this?.meetingPlatforms[j]?.form?.controls.find( (link:any) => link?.name == 'link')
        let meetingId = this?.meetingPlatforms[j]?.form?.controls.find( (meetingId:any) => meetingId?.name == 'meetingId')
        let password = this?.meetingPlatforms[j]?.form?.controls.find( (password:any) => password?.name == 'password')
        if(existingData?.meetingInfo?.link){
          link.value = existingData?.meetingInfo?.link 
          this.changeDetRef.detectChanges();
        }
        if(existingData?.meetingInfo?.meta?.meetingId){
          meetingId.value = existingData?.meetingInfo?.meta?.meetingId
          password.value = existingData?.meetingInfo?.meta?.password
          this.changeDetRef.detectChanges();
        }
        this.changeDetRef.detectChanges();
      }
    }
    
    for (let i = 0; i < this.formData.controls.length; i++) {
      this.formData.controls[i].value = (this.formData.controls[i].type == 'date')? moment.unix(existingData[this.formData.controls[i].name]).format():existingData[this.formData.controls[i].name];
      this.formData.controls[i].options = _.unionBy(this.formData.controls[i].options, this.formData.controls[i].value, 'value');
    }
  }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  setItLater() {
    // this.toast.showMessage("Skipped platform selection. Please provide a meeting platform before starting the session")
    this.secondStepper ? this.router.navigate([`/${"session-detail"}/${this.sessionId}`], {replaceUrl: true}): this.location.back();
  }


  clickOptions(option:any){
    this.selectedHint = option.hint;
    this.selectedValue = option.value;
    
  //  this.meetinLinkIncludes = this.selectedLink == 'Google meet' ? 'meet':'zoom';
  }
  
  onSubmitLink(){
    if (this.platform.myForm.valid){
      let meetingInfo = {
        'meetingInfo':{
        'platform': this.selectedLink,
        'link': this.platform.myForm.value?.link,
        'value': this.selectedValue ,
        "meta": {
          "password": this.platform.myForm.value?.password,
          "meetingId":this.platform.myForm.value?.meetingId
      }

      }}
      this.sessionService.createSession(meetingInfo,this.sessionId).subscribe((result:any)=>{
        if(this.fromSessionDetails){
          this.location.back();
        }else{
          this.router.navigate([`/${"session-detail"}/${this.sessionId}`], {replaceUrl: true})
        }

      })
     
    }
  }
}
