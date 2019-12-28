import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage extends OtherSalesBaseComponent implements OnInit {

  constructor(router: Router, salesService: SalesService, cowService: CowService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService) { 
      super(router, salesService, cowService, formBuilder, storage, datePicker);
    }

  ngOnInit() {
    this.getFarmId();
    this.initiateForm();
  }  

  initiateForm() {
    this.othersalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      itemsold: [null, [Validators.required]],
      cowidsold: [null],
      price: [null, [Validators.required, Validators.min(0.0), Validators.max(100000.00)]],
      quantity: [null, [Validators.max(100000.00)]],
      offtakername: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      offtakercompany: [null],
    });
  }

  onSubmit() {
    if (this.othersalesForm.valid) {
      this.othersalesForm.controls['farmId'].setValue(this.farmId);
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);

      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.salesService.registerOtherSalesRecord(this.othersalesForm.value).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    }
  }

  itemSelected(event) {
    this.showOtherInput = event.detail.value == 'Other';
    this.showSpermInput = event.detail.value == 'Sperm';
    this.showCowList = this.animalTypes.includes(event.detail.value);
    if (this.showCowList) {
      this.loadCowsList(event.detail.value);
    }
  }

  loadCowsList(cowType) {
    this.cowService.getAllCowsOfType(this.farmId, cowType).then(res => {
      this.cowsList = res['cows'];
      this.cowService.cowListState.next(false);
    });
  }

  returnToOverview() {
    this.salesService.otherSalesListState.next(true);
    this.cowService.cowListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }
}
