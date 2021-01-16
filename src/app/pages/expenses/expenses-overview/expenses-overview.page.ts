import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.page.html',
  styleUrls: ['./expenses-overview.page.scss'],
})
export class ExpensesOverviewPage implements OnInit {  

  fromDate: string = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  toDate: string = this.datePicker.today;

  constructor(public expensesService: ExpensesService, private datePicker: DatepickerService) { }

  ngOnInit() { }

  dateChanged(){
    this.expensesService.loadExpensesList(this.fromDate, this.toDate);
    this.expensesService.loadRecurringExpensesList(this.fromDate, this.toDate);
  }
}
