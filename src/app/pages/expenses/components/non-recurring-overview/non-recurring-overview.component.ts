import { Component, OnInit, Input } from '@angular/core';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { NavigationExtras, Router } from '@angular/router';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

@Component({
  selector: 'non-recurring-overview',
  templateUrl: './non-recurring-overview.component.html',
  styleUrls: ['./non-recurring-overview.component.scss'],
})
export class NonRecurringOverviewComponent implements OnInit {

  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() expensesList: Array<IExpensesDetails>;

  constructor(private router: Router, protected expensesService: ExpensesService) { }  

  ngOnInit() {}

  protected openExpenseRecord(expense: IExpensesDetails){
    let navigationExtras: NavigationExtras = {
      state: {
        expensesDetails: expense
      }
    };
    this.router.navigate(['expenses-edit'], navigationExtras);
  }  

  protected isLivestock(expense: IExpensesDetails){
    return expense instanceof LivestockExpensesDetails;
  }
}
