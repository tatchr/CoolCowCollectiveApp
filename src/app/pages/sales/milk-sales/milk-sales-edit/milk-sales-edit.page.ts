import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales/milk-sales-base/milk-sales-base.component';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

@Component({
  selector: 'app-milk-sales-edit',
  templateUrl: './milk-sales-edit.page.html',
  styleUrls: ['./milk-sales-edit.page.scss'],
})
export class MilkSalesEditPage extends MilkSalesBaseComponent implements OnInit {

  milkSaleDetails: MilkSalesDetails;

  constructor(router: Router, formBuilder: FormBuilder, milkSalesService: MilksalesService, 
    storage: Storage, private activatedRoute: ActivatedRoute, private alertService: AlertService) {
    super(router, milkSalesService, formBuilder, storage);

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.milkSaleDetails = this.router.getCurrentNavigation().extras.state.milkSaleDetails;
      }
    });
  }

  ngOnInit() {
    this.selectedDate = this.milkSalesService.datePicker.formatDate(this.milkSaleDetails.date);
    let totalPrice = this.round(this.milkSaleDetails.litersSold * this.milkSaleDetails.pricePerLiter, 2);

    this.milksalesForm = this.formBuilder.group({
      id: this.milkSaleDetails.id,
      farmId: this.milkSaleDetails.farmId,
      date: this.selectedDate,
      literssold: [this.milkSaleDetails.litersSold, [Validators.required, Validators.min(0.0), Validators.max(1000.0)]],
      priceperliter: [this.milkSaleDetails.pricePerLiter, [Validators.required, Validators.min(0.0), Validators.max(999.99)]],
      totalPrice: [{ value: totalPrice, disabled: true }],
      offtaker: [this.milkSaleDetails.offtaker, [Validators.required]],
      offtakername: [this.milkSaleDetails.offtakerName],
      fullamountpaid: [this.milkSaleDetails.fullAmountPaid]
    });

    this.milksalesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['literssold'] * val['priceperliter'], 2);
      this.milksalesForm.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });
  }

  onSubmit() {
    if(this.milksalesForm.valid){
      let updatedSale = new MilkSalesDetails({
        id: this.milksalesForm.value['id'],
        farmId: this.milksalesForm.value['farmId'],
        date: this.selectedDate,
        litersSold: this.milksalesForm.value['literssold'],
        pricePerLiter: this.milksalesForm.value['priceperliter'],
        totalprice: this.milksalesForm.get(['totalPrice']).value,
        offtaker: this.milksalesForm.value['offtaker'],
        offtakerName: this.milksalesForm.value['offtakername'],
        fullAmountPaid: this.milksalesForm.value['fullamountpaid']
      });

      this.milksalesForm.controls['date'].setValue(this.selectedDate);
      this.milkSalesService.updateMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if (val) {
          this.milkSalesService.milkSaleUpdated.next(updatedSale);
          this.returnToOverview();
        }
      });
    }    
  }

  onDelete() {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this milk sales record?';
    let confirmAction = () => {
      this.milkSalesService.deleteMilkSalesRecord(this.milkSaleDetails.id).subscribe(val => {
        if (val) {
          this.milkSalesService.milkSaleDeleted.next(this.milkSaleDetails.id);
          this.returnToOverview();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  } 
}
