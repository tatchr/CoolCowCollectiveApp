import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage implements OnInit {

  othersalesForm: FormGroup;
  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());

  constructor(private router: Router, private salesService: SalesService, private formBuilder: FormBuilder, 
    private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.initiate();
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;      
    });

    this.initiateForm();
  }

  initiateForm(){
    this.othersalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      itemsold: [null, [Validators.required, Validators.minLength(1)]],
      price: [null, [Validators.required, Validators.min(0.0)]],
      offtaker: [null, [Validators.required, Validators.minLength(1)]],
      offtakername: [null],
      fullamountpaid: [false]
    });    
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  onSubmit() {
    if(this.othersalesForm.valid){
      this.othersalesForm.controls['farmId'].setValue(this.farmId);
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.registerOtherSalesRecord(this.othersalesForm.value).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    }    
  }

  returnToOverview(){
    this.salesService.otherSalesListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.selectedDateString = this.datePicker.formatDate(data.data.date);
      }
    });
  }
}
