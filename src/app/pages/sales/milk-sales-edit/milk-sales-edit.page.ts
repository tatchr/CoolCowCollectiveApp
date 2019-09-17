import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

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
    private salesService: SalesService, private datePicker: DatepickerService, private storage: Storage) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.initiate();
  }

  ionViewDidEnter() {
    this.initiate();
  }

  initiate() {
    this.milkSaleId = this.activatedRoute.snapshot.paramMap.get('milkSaleId');    

    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.milksalesForm = this.formBuilder.group({
      id: this.milkSaleId,
      farmId: this.farmId,
      date: [null],
      literssold: [0.0, [Validators.required, Validators.min(0.0)]],
      priceperliter: [0.0, [Validators.required, Validators.min(0.0)]],
      offtaker: [null, [Validators.required, Validators.minLength(1)]],
      offtakername: [null],
      fullamountpaid: [false]
    });
    
    this.getMilkSale();
  }

  onSubmit() {
    if(this.milksalesForm.valid){
      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.updateMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if(val){
          this.salesService.milkSalesListState.next(true);
          this.router.navigateByUrl('/tabs/milk-sales-overview');
        }
      });
    }    
  }

  getMilkSale(){
    this.salesService.getMilkSaleRecord(this.milkSaleId).subscribe(res => {
      this.populateForm(res['milkSale']);
    });
  }

  populateForm(milkSalesDetails){
    this.selectedDateString = this.datePicker.formatDate(milkSalesDetails['date']);
    this.milksalesForm.controls['id'].setValue(milkSalesDetails['id']);   
    this.milksalesForm.controls['farmId'].setValue(milkSalesDetails['farmId']);      
    this.milksalesForm.controls['date'].setValue(this.selectedDateString);   
    this.milksalesForm.controls['literssold'].setValue(milkSalesDetails['litersSold']); 
    this.milksalesForm.controls['priceperliter'].setValue(milkSalesDetails['pricePerLiter']); 
    this.milksalesForm.controls['offtaker'].setValue(milkSalesDetails['offtaker']);      
    this.milksalesForm.controls['offtakername'].setValue(milkSalesDetails['offtakerName']);      
    this.milksalesForm.controls['fullamountpaid'].setValue(milkSalesDetails['fullAmountPaid']);      
  }

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.selectedDateString = this.datePicker.formatDate(data.data.date);
        console.log('val2: ' + this.selectedDateString);
      }
    });
  }
}
