import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales-base/milk-sales-base.component';

@Component({
  selector: 'app-milk-sales-edit',
  templateUrl: './milk-sales-edit.page.html',
  styleUrls: ['./milk-sales-edit.page.scss'],
})
export class MilkSalesEditPage extends MilkSalesBaseComponent implements OnInit {

  milkSaleId: string;

  constructor(router: Router, private activatedRoute: ActivatedRoute, formBuilder: FormBuilder,
    salesService: SalesService, datePicker: DatepickerService, storage: Storage, private alertService: AlertService) {
    super(router, salesService, formBuilder, storage, datePicker);
  }

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.milkSaleId = this.activatedRoute.snapshot.paramMap.get('milkSaleId');
    this.getFarmId();
    this.getMilkSale();
  }

  getMilkSale() {
    this.salesService.getMilkSaleRecord(this.milkSaleId).subscribe(res => {
      this.populateForm(res['milkSale']);
    });
  }

  populateForm(milkSalesDetails) {
    this.selectedDateString = this.datePicker.formatDate(milkSalesDetails.date);
    let totalPrice = this.round(milkSalesDetails.litersSold * milkSalesDetails.pricePerLiter, 2);

    this.milksalesForm = this.formBuilder.group({
      id: this.milkSaleId,
      farmId: this.farmId,
      date: this.selectedDateString,
      literssold: [milkSalesDetails.litersSold, [Validators.required, Validators.min(0.0), Validators.max(1000.0)]],
      priceperliter: [milkSalesDetails.pricePerLiter, [Validators.required, Validators.min(0.0), Validators.max(999.99)]],
      totalPrice: [{ value: totalPrice, disabled: true }],
      offtaker: [milkSalesDetails.offtaker, [Validators.required]],
      offtakername: [milkSalesDetails.offtakerName],
      fullamountpaid: [milkSalesDetails.fullAmountPaid]
    });

    this.milksalesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['literssold'] * val['priceperliter'], 2);
      this.milksalesForm.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });
  }

  onSubmit() {
    if(this.milksalesForm.valid){
      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.updateMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    }    
  }

  onDelete() {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this milk sales record?';
    let confirmAction = () => {
      this.salesService.deleteMilkSalesRecord(this.milkSaleId).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }
}
