import { Component, OnInit, Input } from '@angular/core';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'recurring-overview',
  templateUrl: './recurring-overview.component.html',
  styleUrls: ['./recurring-overview.component.scss'],
})
export class RecurringOverviewComponent implements OnInit {

  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() expensesList: Array<ExpensesRecurringGroup>;
  
  constructor(private router: Router, public expensesService: ExpensesService) { }

  ngOnInit() {}

  private automaticClose = false;
  toggleSection(index: number) {
    this.expensesList[index].open = !this.expensesList[index].open;

    if (this.automaticClose && this.expensesService.recurringExpensesList[index].open) {
      this.expensesService.recurringExpensesList
      .filter((item, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  toggleRecurring(expenseDetails: ExpensesDetails){    
    this.expensesService.toggleRecurringRecords(expenseDetails.recurringId, !expenseDetails.recurringIsActive).subscribe(val => {
      expenseDetails.recurringIsActive = !expenseDetails.recurringIsActive;
    });
  }

  openExpenseRecord(expense: ExpensesDetails){
    let navigationExtras: NavigationExtras = {
      state: {
        expensesDetails: expense
      }
    };
    this.router.navigate(['expenses-edit'], navigationExtras);
  }
}
