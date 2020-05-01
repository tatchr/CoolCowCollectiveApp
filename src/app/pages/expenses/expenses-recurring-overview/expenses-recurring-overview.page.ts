import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router, NavigationExtras } from '@angular/router';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'app-expenses-recurring-overview',
  templateUrl: './expenses-recurring-overview.page.html',
  styleUrls: ['./expenses-recurring-overview.page.scss'],
})
export class ExpensesRecurringOverviewPage implements OnInit {

  constructor(private router: Router, public expensesService: ExpensesService) { }

  ngOnInit() {
  }

  automaticClose = false;
  toggleSection(index) {
    this.expensesService.recurringExpensesList[index].open = !this.expensesService.recurringExpensesList[index].open;

    if (this.automaticClose && this.expensesService.recurringExpensesList[index].open) {
      this.expensesService.recurringExpensesList
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  toggleRecurring(expenseDetails: ExpensesDetails){    
    this.expensesService.toggleRecurringRecords(expenseDetails.recurringId, expenseDetails.recurringIsActive).subscribe(val => {
      expenseDetails.recurringIsActive = !expenseDetails.recurringIsActive;
    });
  }

  openRecurringExpenseRootRecord(rootExpense: ExpensesDetails){    
    let navigationExtras: NavigationExtras = {
      state: {
        expenseDetails: rootExpense
      }
    };
    this.router.navigate(['expenses-recurring-edit'], navigationExtras);
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
