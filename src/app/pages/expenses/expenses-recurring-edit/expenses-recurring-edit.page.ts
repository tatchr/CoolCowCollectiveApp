import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';


@Component({
  selector: 'app-expenses-recurring-edit',
  templateUrl: './expenses-recurring-edit.page.html',
  styleUrls: ['./expenses-recurring-edit.page.scss'],
})
export class ExpensesRecurringEditPage implements OnInit {

  expenseDetails: ExpensesDetails;
  
  constructor(private router: Router, public service: ExpensesService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private alertService: AlertService) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.expenseDetails = this.router.getCurrentNavigation().extras.state.expenseDetails;
        }
      });
    }

    ngOnInit() {
      this.service.initiateExistingForm(this.expenseDetails);
      this.service.expensesForm.addControl('recurringperiodindays', new FormControl(this.expenseDetails.recurringPeriodInDays, [Validators.required, Validators.min(1)]));
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
          recurringPeriodInDays: this.expenseDetails.recurringPeriodInDays,
          recurringFromDate: this.service.expensesForm.value['recurringFromDate'],
          recurringId: this.service.expensesForm.value['recurringId'],
          registrationDate: this.service.expensesForm.value['registrationDate'],
          updateDate: this.service.expensesForm.value['updateDate'],
        });  
        
        this.service.updateRootExpensesRecord(this.service.expensesForm.getRawValue()).subscribe(val => {
          if (val) {
            this.service.expenseUpdated.next(updatedExpense);
            this.service.returnToOverview();
          }
        });
      }    
    }
  
    onDelete() {
      let header = 'Delete recurring records?';
      let message = 'Deleting this root record will also delete all of its corresponding historical child records. Are you sure?';
      let confirmAction = () => {
        this.service.deleteExpensesRecurringRecords(this.expenseDetails.recurringId).subscribe(val => {
          if (val) {
            this.service.expenseDeleted.next(this.expenseDetails.id);
            this.service.returnToOverview();
          }
        });
      };
      this.alertService.presentAlertConfirm(header, message, confirmAction);
    }    
}
