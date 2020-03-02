import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesBaseComponent } from 'src/app/pages/expenses/expenses-base/expenses-base.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';


@Component({
  selector: 'app-expenses-recurring-edit',
  templateUrl: './expenses-recurring-edit.page.html',
  styleUrls: ['./expenses-recurring-edit.page.scss'],
})
export class ExpensesRecurringEditPage extends ExpensesBaseComponent implements OnInit {

  expenseDetails: ExpensesDetails;
  
  constructor(router: Router, expensesService: ExpensesService, formBuilder: FormBuilder,
    storage: Storage, private activatedRoute: ActivatedRoute, private alertService: AlertService) { 
      super(router, expensesService, formBuilder, storage);

      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.expenseDetails = this.router.getCurrentNavigation().extras.state.expenseDetails;
        }
      });
    }

    ngOnInit() {
      this.selectedDate = this.expensesService.datePicker.formatDate(this.expenseDetails.date);
      this.expensesForm = this.formBuilder.group({
        id: this.expenseDetails.id,
        farmId: this.expenseDetails.farmId,
        date: this.selectedDate,
        type: [this.expenseDetails.type, [Validators.required]],
        itembought: [this.expenseDetails.itemBought, [Validators.required]],
        price: [this.expenseDetails.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
        quantity: [this.expenseDetails.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
        quantityUnit: [this.expenseDetails.quantityUnit],
        totalprice: [{ value: this.expenseDetails.totalPrice, disabled: true }],
        sellername: [this.expenseDetails.sellerName],
        sellercompany: [this.expenseDetails.sellerCompany],
        isrecurring: [this.expenseDetails.isRecurring],
        recurringperiodindays: [this.expenseDetails.recurringPeriodInDays],
        recurringId: [this.expenseDetails.recurringId]
      });
  
      this.expensesForm.valueChanges.subscribe(val => {
        let totalPrice = this.round(val['price'] * val['quantity'], 2);
        this.expensesForm.get('totalprice').patchValue(totalPrice, { emitEvent: false });
      });
    }
  
    onSubmit() {
      if(this.expensesForm.valid){
        let updatedExpense = new ExpensesDetails({
          id: this.expensesForm.value['id'],
          farmId: this.expensesForm.value['farmId'],
          date: this.selectedDate,
          type: this.expensesForm.value['type'],
          itemBought: this.expensesForm.value['itembought'],
          price: this.expensesForm.value['price'],
          quantity: this.expensesForm.value['quantity'],
          quantityUnit: this.expensesForm.value['quantityUnit'],
          totalPrice: this.expensesForm.value['price'] * this.expensesForm.value['quantity'],
          sellerName: this.expensesForm.value['sellername'],
          sellerCompany: this.expensesForm.value['sellercompany'],
          isRecurring: this.expensesForm.value['isrecurring'],
          recurringPeriodInDays: this.expensesForm.value['recurringperiodindays'],
          recurringId: this.expensesForm.value['recurringId']
        });
  
        this.expensesForm.controls['date'].setValue(this.selectedDate);
        this.expensesService.updateExpensesRecord(this.expensesForm.getRawValue()).subscribe(val => {
          if (val) {
            this.expensesService.expenseUpdated.next(updatedExpense);
            this.returnToOverview();
          }
        });
      }    
    }
  
    onDelete() {
      let header = 'Delete this record?';
      let message = 'Are you sure that you want to permanently delete this expense record?';
      let confirmAction = () => {
        this.expensesService.deleteExpensesRecord(this.expenseDetails.id).subscribe(val => {
          if (val) {
            this.expensesService.expenseDeleted.next(this.expenseDetails.id);
            this.returnToOverview();
          }
        });
      };
      this.alertService.presentAlertConfirm(header, message, confirmAction);
    }
  
    itemSelected(event) {
      // this.showOtherInput = event.detail.value == 'Other';
      // this.showSpermInput = event.detail.value == 'Sperm';
      // this.showCowList = this.cowService.animalTypes.includes(event.detail.value);
      // if (this.showCowList) {
      //   this.loadCowsList(event.detail.value);
      // }
    }

}
