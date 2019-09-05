import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-register-cow',
  templateUrl: './register-cow.page.html',
  styleUrls: ['./register-cow.page.scss'],
  providers: [Keyboard]
})
export class RegisterCowPage implements OnInit {

  cowForm: FormGroup;
  gen: String;
  datePickerObj: any;
  farmId: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private cowService: CowService, private datePicker: DatepickerService, private keyboard: Keyboard) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.farmId = this.activatedRoute.snapshot.paramMap.get('farmId');
    this.cowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      farmId: this.farmId,
      tagnumber: [null, [Validators.maxLength(50)]],
      birthdate: [null],
      cowtype: [null],
      breed: [null],
      cowstatus: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    }); 
  }

  onSubmit() {
    if(this.cowForm.valid){
      this.cowService.registerCow(this.cowForm.value).subscribe(val => {
        console.log('val: ' + val);
        if(val){
          this.cowService.cowListState.next(true);
          this.router.navigateByUrl('/tabs/herd');
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
    return moment(date).format('YYYY-MM-DD');
  }
}
