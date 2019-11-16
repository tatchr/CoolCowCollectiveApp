import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesBaseComponent } from 'src/app/pages/expenses/expenses-base/expenses-base.component';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.page.html',
  styleUrls: ['./expenses-edit.page.scss'],
})
export class ExpensesEditPage extends ExpensesBaseComponent implements OnInit {

  expenseId: string;

  constructor(router: Router, expensesService: ExpensesService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService, private activatedRoute: ActivatedRoute, private alertService: AlertService) { 
      super(router, expensesService, formBuilder, storage, datePicker);
    }

  ngOnInit() {
    this.expenseId = this.activatedRoute.snapshot.paramMap.get('expenseId');
    this.getFarmId();
    this.getExpense();
  }
  getExpense() {
    this.expensesService.getExpenseRecord(this.expenseId).subscribe(res => {
      this.populateForm(res['expense']);
    });
  }
  populateForm(expenseDetails) {
    this.selectedDateString = this.datePicker.formatDate(expenseDetails.date);

    this.expensesForm = this.formBuilder.group({
      id: this.expenseId,
      farmId: this.farmId,
      date: this.selectedDateString,
      type: [expenseDetails.type, [Validators.required]],
      itembought: [expenseDetails.itemBought, [Validators.required]],
      price: [expenseDetails.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [expenseDetails.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [expenseDetails.quantityUnit],
      totalPrice: [{ value: expenseDetails.totalPrice, disabled: true }],
      sellername: [expenseDetails.sellerName],
      sellercompany: [expenseDetails.sellerCompany],
      isrecurring: [expenseDetails.isRecurring],
      recurringperiodindays: [expenseDetails.recurringPeriodInDays],
      recurringId: [expenseDetails.recurringId]
    });

    this.expensesForm.valueChanges.subscribe(val => {
      let totalPrice = this.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });
  }

  onSubmit() {
    if(this.expensesForm.valid){
      this.expensesForm.controls['date'].setValue(this.selectedDateString);
      this.expensesService.updateExpensesRecord(this.expensesForm.getRawValue()).subscribe(val => {
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
      this.expensesService.deleteExpensesRecord(this.expenseId).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

}
