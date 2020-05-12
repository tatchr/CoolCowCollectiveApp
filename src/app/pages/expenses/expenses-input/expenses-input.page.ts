import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.page.html',
  styleUrls: ['./expenses-input.page.scss'],
})
export class ExpensesInputPage implements OnInit {

  constructor(private router: Router, public service: ExpensesService) { }

  ngOnInit() {
    this.service.initiateNewForm();
  }

  onSubmit() {
    if(this.service.selectedType == 'Labour'){
      let employeeName = this.service.expensesForm.value['itembought'];
      this.service.expensesForm.controls['sellername'].setValue(employeeName);
      this.service.expensesForm.controls['sellercompany'].setValue(employeeName);
    }

    if (this.service.expensesForm.valid) {
      this.service.expensesForm.controls['type'].setValue(this.service.selectedType);
      this.service.expensesForm.controls['farmId'].setValue(this.service.farmId);
      this.service.expensesForm.controls['date'].setValue(this.service.selectedDate);
      this.service.expensesForm.controls['registrationDate'].setValue(new Date());
      this.service.registerExpensesRecord(this.service.expensesForm.getRawValue()).then(val => {
        if (val) {
          this.service.expenseRegistered.next(val['expense']);
          this.service.selectedType = null;

          let isRecurring = this.service.expensesForm.value['recurringisactive'];
          if(isRecurring){
            this.router.navigateByUrl('/expenses-recurring-overview');
          }
          else{
            this.router.navigateByUrl('/expenses-overview');
          }
        }
      });
    }
  }
}
