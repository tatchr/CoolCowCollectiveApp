import { Component, OnInit, Input } from '@angular/core';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'non-recurring-overview',
  templateUrl: './non-recurring-overview.component.html',
  styleUrls: ['./non-recurring-overview.component.scss'],
})
export class NonRecurringOverviewComponent implements OnInit {

  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() expensesList: Array<ExpensesDetails>;
  @Input() livestockExpensesList: Array<LivestockExpensesDetails>;

  constructor(private router: Router, protected expensesService: ExpensesService) { }  

  ngOnInit() {}

  protected openExpenseRecord(expense: ExpensesDetails){
    let navigationExtras: NavigationExtras = {
      state: {
        expenseDetails: expense
      }
    };
    this.router.navigate(['expenses-edit'], navigationExtras);
  }

}
