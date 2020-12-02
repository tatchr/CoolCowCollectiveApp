import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router } from '@angular/router';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-expenses-recurring-overview',
  templateUrl: './expenses-recurring-overview.page.html',
  styleUrls: ['./expenses-recurring-overview.page.scss'],
})
export class ExpensesRecurringOverviewPage implements OnInit {

  fromDate: Date = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  toDate: Date = this.datePicker.today;

  constructor(private router: Router, public expensesService: ExpensesService, private datePicker: DatepickerService) { }

  ngOnInit() {
  }

  dateChanged(){
    this.expensesService.loadRecurringExpensesList(this.fromDate, this.toDate);
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
}
