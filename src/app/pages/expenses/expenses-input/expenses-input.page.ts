import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesBaseComponent } from 'src/app/pages/expenses/expenses-base/expenses-base.component';

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.page.html',
  styleUrls: ['./expenses-input.page.scss'],
})
export class ExpensesInputPage extends ExpensesBaseComponent implements OnInit {

  constructor(router: Router, expensesService: ExpensesService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService) {
    super(router, expensesService, formBuilder, storage, datePicker);
  }

  ngOnInit() {
    this.getFarmId();
    this.initiateForm();
  }

  initiateForm() {
    this.expensesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      type: [null, [Validators.required]],
      itembought: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [null, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [null],
      totalPrice: [{ value: 0.0, disabled: true }],
      sellername: [null],
      sellercompany: [null],
      isrecurring: [false],
      recurringperiodindays: [null]
    });

    this.expensesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });
  }

  itemSelected(event) {
    // this.showOtherInput = event.detail.value == 'Other';
    // this.showSpermInput = event.detail.value == 'Sperm';
    // this.showCowList = this.animalTypes.includes(event.detail.value);
    // if (this.showCowList) {
    //   this.loadCowsList(event.detail.value);
    // }
  }

  onSubmit() {
    if (this.expensesForm.valid) {
      this.expensesForm.controls['farmId'].setValue(this.farmId);
      this.expensesForm.controls['date'].setValue(this.selectedDateString);
      this.expensesService.registerExpensesRecord(this.expensesForm.getRawValue()).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    }
  }

  // returnToOverview(){
  //   this.expensesService.expensesListState.next(true);
  //   this.router.navigateByUrl('/tabs/expenses-overview');
  // }

  // async openDatePicker() {
  //   this.datePickerObj.inputDate = this.selectedDateString;
  //   const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

  //   await datePickerModal.present();
  //   datePickerModal.onDidDismiss().then((data) => {
  //     if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
  //       this.selectedDateString = this.datePicker.formatDate(data.data.date);
  //     }
  //   });
  // }

}
