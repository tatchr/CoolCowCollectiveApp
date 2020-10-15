import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales/milk-sales-base/milk-sales-base.component';
import { FarmService } from 'src/app/services/farm/farm.service';

@Component({
  selector: 'app-milk-sales-input',
  templateUrl: './milk-sales-input.page.html',
  styleUrls: ['./milk-sales-input.page.scss'],
})
export class MilkSalesInputPage extends MilkSalesBaseComponent implements OnInit {

  constructor(router: Router, milkSalesService: MilksalesService, formBuilder: FormBuilder,
    storage: Storage, farmService: FarmService) {
    super(router, milkSalesService, formBuilder, storage, farmService);
  }

  ngOnInit() {
    this.getFarmId();
    
    this.milksalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDate],
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
      this.milksalesForm.controls['date'].setValue(this.selectedDate);
      this.milksalesForm.controls['farmId'].setValue(this.milkSalesService.farmId);
      this.milkSalesService.registerMilkSalesRecord(this.milksalesForm.value).then(val => {
        if (val) {
          this.milkSalesService.milkSaleRegistered.next(val['milkSale']);
          this.returnToOverview();
        }
      });
    }
  }
}
