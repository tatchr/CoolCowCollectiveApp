import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-milk-sales-edit',
  templateUrl: './milk-sales-edit.page.html',
  styleUrls: ['./milk-sales-edit.page.scss'],
})
export class MilkSalesEditPage implements OnInit {

  milkSaleId: string;
  milksalesForm: FormGroup;
  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());  

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private salesService: SalesService, private datePicker: DatepickerService, private storage: Storage, private alertService: AlertService) { }

  ngOnInit() {
    this.initiate();
  }
  
  initiate() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.milkSaleId = this.activatedRoute.snapshot.paramMap.get('milkSaleId');
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.getMilkSale();   
  }  

  getMilkSale(){
    this.salesService.getMilkSaleRecord(this.milkSaleId).subscribe(res => {
      this.populateForm(res['milkSale']);
    });
  }

  populateForm(milkSalesDetails){
    this.selectedDateString = this.datePicker.formatDate(milkSalesDetails.date);
    let totalPrice = this.round(milkSalesDetails.litersSold * milkSalesDetails.pricePerLiter, 2);

    this.milksalesForm = this.formBuilder.group({
      id: this.milkSaleId,
      farmId: this.farmId,
      date: this.selectedDateString,
      literssold: [milkSalesDetails.litersSold, [Validators.required, Validators.min(0.0)]],
      priceperliter: [milkSalesDetails.pricePerLiter, [Validators.required, Validators.min(0.0)]],
      totalPrice: [{value: totalPrice, disabled : true}],
      offtaker: [milkSalesDetails.offtaker, [Validators.required, Validators.minLength(1)]],
      offtakername: [milkSalesDetails.offtakerName],
      fullamountpaid: [milkSalesDetails.fullAmountPaid]
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
      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.updateMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    }    
  }

  onDelete(){
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this milk sales record?';
    let confirmAction = () => { 
      this.salesService.deleteMilkSalesRecord(this.milkSaleId).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    };    
    this.alertService.presentAlertConfirm(header, message, confirmAction);
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
