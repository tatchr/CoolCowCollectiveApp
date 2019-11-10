import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-cow-passport',
  templateUrl: './cow-passport.page.html',
  styleUrls: ['./cow-passport.page.scss'],
  providers: [Keyboard]
})
export class CowPassportPage implements OnInit {

  cowForm: FormGroup;
  datePickerObj: any;
  cowId: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private cowService: CowService, private datePicker: DatepickerService, public keyboard: Keyboard) { }

  ngOnInit() {
    this.initiate();
  }

  initiate(){
    this.cowId = this.activatedRoute.snapshot.paramMap.get('cowId');
    this.getCow(this.cowId);

    this.cowForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      farmId: [null],
      tagnumber: [null, [Validators.maxLength(50)]],
      birthdate: [null],
      cowtype: [null, [Validators.required]],
      breed: [null],
      cowstatus: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      cowstate: [null],
      registrationdate: [null]
    }); 
  }

  getCow(cowId){
    this.cowService.getCow(cowId).subscribe(res => {
      this.populateForm(res['cow']);
    });
  }

  populateForm(cowDetails){
    this.cowForm.controls['id'].setValue(cowDetails['id']);      
    this.cowForm.controls['name'].setValue(cowDetails['name']);      
    this.cowForm.controls['farmId'].setValue(cowDetails['farmId']);      
    this.cowForm.controls['tagnumber'].setValue(cowDetails['tagNumber']);      
    this.cowForm.controls['birthdate'].setValue(this.formatDate(cowDetails['birthDate']));   
    this.cowForm.controls['cowtype'].setValue(cowDetails['cowType']); 
    this.cowForm.controls['breed'].setValue(cowDetails['breed']); 
    this.cowForm.controls['cowstatus'].setValue(cowDetails['cowStatus']);      
    this.cowForm.controls['cowstate'].setValue(cowDetails['cowState']);      
    this.cowForm.controls['registrationdate'].setValue(cowDetails['registrationDate']);      
  }

  updateCow() {
    if(this.cowForm.valid){
      this.cowService.updateCow(this.cowForm.value).subscribe(val => {
        if(val){
          this.cowService.cowListState.next(true);
          this.router.navigateByUrl('tabs/herd');
        }
      });
    }    
  }

  async openDatePicker(formControl) {    
    let fromDate = new Date('1970-01-01');
    let toDate = this.formatDate(new Date());
    this.datePickerObj = this.datePicker.getDatepickerObj('', fromDate, toDate);
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if(typeof data.data !== 'undefined' && data.data.date !== 'Invalid date'){
        this.cowForm.controls[formControl].setValue(this.formatDate(data.data.date));
      }
    });
  }

  formatDate(date){
    return date != null 
    ? moment(date).format('YYYY-MM-DD') 
    : null;
  }
}
