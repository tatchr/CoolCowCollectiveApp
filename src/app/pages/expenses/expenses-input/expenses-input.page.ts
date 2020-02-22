import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesBaseComponent } from 'src/app/pages/expenses/expenses-base/expenses-base.component';

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.page.html',
  styleUrls: ['./expenses-input.page.scss'],
})
export class ExpensesInputPage extends ExpensesBaseComponent implements OnInit {

  constructor(router: Router, expensesService: ExpensesService, formBuilder: FormBuilder,
    storage: Storage) {
    super(router, expensesService, formBuilder, storage);
  }

  ngOnInit() {
    this.getFarmId();
    this.initiateForm();
  }

  initiateForm() {
    this.expensesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDate],
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
    // this.showCowList = this.cowService.animalTypes.includes(event.detail.value);
    // if (this.showCowList) {
    //   this.loadCowsList(event.detail.value);
    // }
  }

  onSubmit() {
    if (this.expensesForm.valid) {
      this.expensesForm.controls['farmId'].setValue(this.farmId);
      this.expensesForm.controls['date'].setValue(this.selectedDate);
      this.expensesService.registerExpensesRecord(this.expensesForm.getRawValue()).then(val => {
        if (val) {
          this.expensesService.expenseRegistered.next(val['expense']);
          this.returnToOverview();
        }
      });
    }
  }
}
