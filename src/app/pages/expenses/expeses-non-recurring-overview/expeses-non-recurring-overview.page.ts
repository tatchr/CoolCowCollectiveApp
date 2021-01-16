import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-expeses-non-recurring-overview',
  templateUrl: './expeses-non-recurring-overview.page.html',
  styleUrls: ['./expeses-non-recurring-overview.page.scss'],
})
export class ExpesesNonRecurringOverviewPage implements OnInit {

  fromDate: string = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  toDate: string = this.datePicker.today;

  constructor(public expensesService: ExpensesService, private datePicker: DatepickerService) { }

  ngOnInit() {
  }

  dateChanged(){
    this.expensesService.loadExpensesList(this.fromDate, this.toDate);
  }
}
