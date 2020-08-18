import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router, NavigationExtras } from '@angular/router';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'app-expeses-non-recurring-overview',
  templateUrl: './expeses-non-recurring-overview.page.html',
  styleUrls: ['./expeses-non-recurring-overview.page.scss'],
})
export class ExpesesNonRecurringOverviewPage implements OnInit {

  panelOpenState = false;

  constructor(private router: Router, public expensesService: ExpensesService) { }

  ngOnInit() {
  }

  openExpenseRecord(expense: ExpensesDetails){
    let navigationExtras: NavigationExtras = {
      state: {
        expenseDetails: expense
      }
    };
    this.router.navigate(['expenses-edit'], navigationExtras);
  }  
  
  async openFromDatePicker(){
    this.expensesService.selectedPeriod = '';
    this.expensesService.selectedFromDate = await this.expensesService.datePicker.openDatePicker(this.expensesService.selectedFromDate);
    this.expensesService.loadExpensesList();    
  }

  async openToDatePicker(){
    this.expensesService.selectedPeriod = '';
    this.expensesService.selectedToDate = await this.expensesService.datePicker.openDatePicker(this.expensesService.selectedToDate);
    this.expensesService.loadExpensesList();    
  }

}
