import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.page.html',
  styleUrls: ['./expenses-edit.page.scss'],
})
export class ExpensesEditPage implements OnInit {

  protected selectedDate: Date;
  expenseDetails: ExpensesDetails;

  constructor(private router: Router, public service: ExpensesService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private alertService: AlertService) { 
      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.expenseDetails = this.router.getCurrentNavigation().extras.state.expenseDetails;
          this.selectedDate = this.expenseDetails.date;       
        }
      });
    }

  ngOnInit() {
    this.service.initiateExistingForm(this.expenseDetails);
  }

  onSubmit() {    
    if(this.service.expensesForm.valid){
      this.service.expensesForm.controls['updateDate'].setValue(new Date());
      this.service.expensesForm.controls['date'].setValue(this.service.selectedDate);
      let updatedExpense = new ExpensesDetails({
        id: this.service.expensesForm.value['id'],
        farmId: this.service.expensesForm.value['farmId'],
        date: this.service.selectedDate,
        type: this.service.expensesForm.value['type'],
        itemBought: this.service.expensesForm.value['itembought'],
        price: this.service.expensesForm.value['price'],
        quantity: this.service.expensesForm.value['quantity'],
        quantityUnit: this.service.expensesForm.value['quantityUnit'],
        totalPrice: this.service.expensesForm.value['price'] * this.service.expensesForm.value['quantity'],
        sellerName: this.service.expensesForm.value['sellername'],
        sellerCompany: this.service.expensesForm.value['sellercompany'],
        isRootRecord: this.service.expensesForm.value['isrootrecord'],
        recurringIsActive: this.service.expensesForm.value['recurringisactive'],
        recurringFromDate: this.service.expensesForm.value['recurringFromDate'],
        recurringId: this.service.expensesForm.value['recurringId'],
        registrationDate: this.service.expensesForm.value['registrationDate'],
        updateDate: this.service.expensesForm.value['updateDate'],
      });
      
      this.service.updateExpensesRecord(this.service.expensesForm.getRawValue()).subscribe(val => {
        if (val) {
          this.service.expenseUpdated.next(updatedExpense);
          this.service.returnToOverview();
        }
      });
    }    
  }

  onDelete() {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this expense record?';
    let confirmAction = () => {
      this.service.deleteExpensesRecord(this.expenseDetails.id).subscribe(val => {
        if (val) {
          this.service.expenseDeleted.next(this.expenseDetails.id);
          this.service.returnToOverview();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

}
