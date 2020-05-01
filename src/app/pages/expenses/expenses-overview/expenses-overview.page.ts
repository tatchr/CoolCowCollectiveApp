import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router, NavigationExtras } from '@angular/router';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.page.html',
  styleUrls: ['./expenses-overview.page.scss'],
})
export class ExpensesOverviewPage implements OnInit {  

  panelOpenState = false;

  constructor(private router: Router, public expensesService: ExpensesService) { }

  ngOnInit() {
    this.expensesService.expenseRegistered.subscribe(newExpense => {
      if (newExpense) {
        this.expensesService.loadExpensesList(); 
        this.expensesService.loadRecurringExpensesList(); 
      }
    });

    this.expensesService.expenseDeleted.subscribe(expenseId => {
      if (expenseId) {
        this.expensesService.loadExpensesList();
        this.expensesService.loadRecurringExpensesList();
      }
    });

    this.expensesService.expenseUpdated.subscribe(sale => {
      if (sale) {
        this.expensesService.loadExpensesList();
        this.expensesService.loadRecurringExpensesList();
      }
    });  
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
