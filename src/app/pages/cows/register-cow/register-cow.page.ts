import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-register-cow',
  templateUrl: './register-cow.page.html',
  styleUrls: ['./register-cow.page.scss'],
})
export class RegisterCowPage implements OnInit {

  newCowForm: FormGroup;
  gen: String;
  datePickerObj: any;
  farmId: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private cowService: CowService, private datePicker: DatepickerService) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.farmId = this.activatedRoute.snapshot.paramMap.get('farmId');
    this.newCowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      farmId: this.farmId,
      tagnumber: [null, [Validators.maxLength(50)]],
      birthdate: [null],
      weight: [null],
      gender: [null, [Validators.minLength(1), Validators.maxLength(1)]],
      veterinarian: [null, [Validators.maxLength(50)]],
      //inseminationdate: [''],
      cowstatus: ['']
    }); 
  }

  onSubmit() {
    this.cowService.registerCow(this.newCowForm.value).subscribe(val => {
      if(val){
        this.router.navigateByUrl('/herd');
      }
    });
  }

  async openDatePicker(formControl) {    
    let fromDate = new Date('1970-01-01');
    let toDate = new Date('2025-12-31');
    this.datePickerObj = this.datePicker.getDatepickerObj('', fromDate, toDate);
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if(typeof data.data !== 'undefined' && data.data.date !== 'Invalid date'){
        this.newCowForm.controls[formControl].setValue(this.formatDate(data.data.date));
      }
    });
  }

  formatDate(date){
    return moment(date).format('YYYY-MM-DD');
  }
}
