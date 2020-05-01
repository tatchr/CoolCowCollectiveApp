import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesBaseComponent } from 'src/app/pages/expenses/expenses-base/expenses-base.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { Location } from '@angular/common';


@Component({
  selector: 'app-expenses-recurring-edit',
  templateUrl: './expenses-recurring-edit.page.html',
  styleUrls: ['./expenses-recurring-edit.page.scss'],
})
export class ExpensesRecurringEditPage extends ExpensesBaseComponent implements OnInit {

  expenseDetails: ExpensesDetails;
  
  constructor(router: Router, expensesService: ExpensesService, formBuilder: FormBuilder,
    storage: Storage, private activatedRoute: ActivatedRoute, private alertService: AlertService, location: Location) { 
      super(router, expensesService, formBuilder, storage, location);

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
        type: [{value: this.expenseDetails.type, disabled: true}, [Validators.required]],
        itembought: [{value: this.expenseDetails.itemBought, disabled: true}, [Validators.required]],
        price: [this.expenseDetails.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
        quantity: [this.expenseDetails.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
        quantityUnit: [this.expenseDetails.quantityUnit],
        totalprice: [{ value: this.expenseDetails.totalPrice, disabled: true }],
        sellername: [this.expenseDetails.sellerName],
        sellercompany: [this.expenseDetails.sellerCompany],
        isrootrecord: [this.expenseDetails.isRootRecord],
        recurringisactive: [this.expenseDetails.recurringIsActive],
        recurringperiodindays: [this.expenseDetails.recurringPeriodInDays],
        recurringFromDate: [this.expenseDetails.recurringFromDate],
        recurringId: [this.expenseDetails.recurringId],
        registrationDate: [this.expenseDetails.registrationDate],
        updateDate: [null]
      });
  
      this.expensesForm.valueChanges.subscribe(val => {
        let totalPrice = this.round(val['price'] * val['quantity'], 2);
        this.expensesForm.get('totalprice').patchValue(totalPrice, { emitEvent: false });
      });
    }
  
    onSubmit() {      
      if(this.expensesForm.valid){
        this.expensesForm.controls['updateDate'].setValue(new Date());
        this.expensesForm.controls['date'].setValue(this.selectedDate);
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
          isRootRecord: this.expensesForm.value['isrootrecord'],
          recurringIsActive: this.expensesForm.value['recurringisactive'],
          recurringPeriodInDays: this.expensesForm.value['recurringperiodindays'],
          recurringFromDate: this.expensesForm.value['recurringFromDate'],
          recurringId: this.expensesForm.value['recurringId'],
          registrationDate: this.expensesForm.value['registrationDate'],
          updateDate: this.expensesForm.value['updateDate'],
        });  
        
        this.expensesService.updateRootExpensesRecord(this.expensesForm.getRawValue()).subscribe(val => {
          if (val) {
            this.expensesService.expenseUpdated.next(updatedExpense);
            this.returnToOverview();
          }
        });
      }    
    }
  
    onDelete() {
      let header = 'Delete recurring records?';
      let message = 'Deleting this root record will also delete all of its corresponding historical child records. Are you sure?';
      let confirmAction = () => {
        this.expensesService.deleteExpensesRecurringRecords(this.expenseDetails.recurringId).subscribe(val => {
          if (val) {
            this.expensesService.expenseDeleted.next(this.expenseDetails.id);
            this.returnToOverview();
          }
        });
      };
      this.alertService.presentAlertConfirm(header, message, confirmAction);
    }    
}
