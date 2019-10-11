import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-milk-sales-input',
  templateUrl: './milk-sales-input.page.html',
  styleUrls: ['./milk-sales-input.page.scss'],
})
export class MilkSalesInputPage implements OnInit {

  milksalesForm: FormGroup;
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
    this.milksalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      literssold: [null, [Validators.required, Validators.min(0.0)]],
      priceperliter: [null, [Validators.required, Validators.min(0.0)]],
      totalPrice: [{value: 0.0, disabled : true}],
      offtaker: [null, [Validators.required, Validators.minLength(1)]],
      offtakername: [null],
      fullamountpaid: [false]
    });

    this.milksalesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['literssold'] * val['priceperliter'], 2);      
      this.milksalesForm.get('totalPrice').patchValue(totalPrice, {emitEvent: false});
    });
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  onSubmit() {
    if(this.milksalesForm.valid){
      this.milksalesForm.controls['farmId'].setValue(this.farmId);
      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.registerMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    }    
  }

  returnToOverview(){
    this.salesService.milkSalesListState.next(true);
    this.router.navigateByUrl('/tabs/milk-sales-overview');
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
