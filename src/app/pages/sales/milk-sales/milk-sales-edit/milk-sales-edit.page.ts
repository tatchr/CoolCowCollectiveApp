import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales/milk-sales-base/milk-sales-base.component';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

@Component({
  selector: 'app-milk-sales-edit',
  templateUrl: './milk-sales-edit.page.html',
  styleUrls: ['./milk-sales-edit.page.scss'],
})
export class MilkSalesEditPage extends MilkSalesBaseComponent implements OnInit {

  milkSaleId: string;
  milkSaleDetails: MilkSalesDetails;

  constructor(router: Router, formBuilder: FormBuilder, salesService: SalesService, 
    datePicker: DatepickerService, storage: Storage, private activatedRoute: ActivatedRoute, private alertService: AlertService) {
    super(router, salesService, formBuilder, storage, datePicker);

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.milkSaleDetails = this.router.getCurrentNavigation().extras.state.milkSaleDetails;
      }
    });
  }

  ngOnInit() {
    this.selectedDateString = this.datePicker.formatDate(this.milkSaleDetails.date);
    let totalPrice = this.round(this.milkSaleDetails.litersSold * this.milkSaleDetails.pricePerLiter, 2);

    this.milksalesForm = this.formBuilder.group({
      id: this.milkSaleDetails.id,
      farmId: this.milkSaleDetails.farmId,
      date: this.selectedDateString,
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
        date: this.milksalesForm.value['date'],
        litersSold: this.milksalesForm.value['literssold'],
        pricePerLiter: this.milksalesForm.value['priceperliter'],
        totalprice: this.milksalesForm.get(['totalPrice']).value,
        offtaker: this.milksalesForm.value['offtaker'],
        offtakerName: this.milksalesForm.value['offtakername'],
        fullAmountPaid: this.milksalesForm.value['fullamountpaid']
      });

      this.milksalesForm.controls['date'].setValue(this.selectedDateString);
      this.salesService.updateMilkSalesRecord(this.milksalesForm.value).subscribe(val => {
        if (val) {
          this.salesService.milkSaleUpdated.next(updatedSale);
          this.router.navigateByUrl('/tabs/milk-sales-overview');
        }
      });
    }    
  }

  onDelete() {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this milk sales record?';
    let confirmAction = () => {
      this.salesService.deleteMilkSalesRecord(this.milkSaleDetails.id).subscribe(val => {
        if (val) {
          this.salesService.milkSaleDeleted.next(this.milkSaleDetails.id);
          this.router.navigateByUrl('/tabs/milk-sales-overview');
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }
}
