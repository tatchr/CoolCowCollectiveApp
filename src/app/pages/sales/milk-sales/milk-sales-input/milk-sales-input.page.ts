import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales/milk-sales-base/milk-sales-base.component';

@Component({
  selector: 'app-milk-sales-input',
  templateUrl: './milk-sales-input.page.html',
  styleUrls: ['./milk-sales-input.page.scss'],
})
export class MilkSalesInputPage extends MilkSalesBaseComponent implements OnInit {

  constructor(router: Router, salesService: SalesService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService) {
    super(router, salesService, formBuilder, storage, datePicker);
  }

  ngOnInit() {
    this.getFarmId();
    this.milksalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      literssold: [null, [Validators.required, Validators.min(0.0), Validators.max(1000.0)]],
      priceperliter: [null, [Validators.required, Validators.min(0.0), Validators.max(999.99)]],
      totalPrice: [{ value: 0.0, disabled: true }],
      offtaker: [null, [Validators.required]],
      offtakername: [null],
      fullamountpaid: [false]
    });

    this.milksalesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['literssold'] * val['priceperliter'], 2);
      this.milksalesForm.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });
  } 

  onSubmit() {
    if(this.milksalesForm.valid){
      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.milksalesForm.controls['farmId'].setValue(this.farmId);
      this.salesService.registerMilkSalesRecord(this.milksalesForm.value).then(val => {
        if (val) {
          this.salesService.milkSaleRegistered.next(val['milkSale']);
          this.router.navigateByUrl('/tabs/milk-sales-overview');
        }
      });
    }
  }
}
