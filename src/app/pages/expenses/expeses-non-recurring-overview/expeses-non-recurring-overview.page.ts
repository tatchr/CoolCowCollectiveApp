import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router, NavigationExtras } from '@angular/router';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-expeses-non-recurring-overview',
  templateUrl: './expeses-non-recurring-overview.page.html',
  styleUrls: ['./expeses-non-recurring-overview.page.scss'],
})
export class ExpesesNonRecurringOverviewPage implements OnInit {

  protected fromDate: Date = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  protected toDate: Date = this.datePicker.today;

  panelOpenState = false;

  constructor(private router: Router, public expensesService: ExpensesService, private datePicker: DatepickerService) { }

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

  dateChanged(){
    this.expensesService.loadExpensesList(this.fromDate, this.toDate);
    this.expensesService.loadLivestockExpensesList(this.fromDate, this.toDate);
    this.expensesService.loadRecurringExpensesList(this.fromDate, this.toDate);
  }
}
