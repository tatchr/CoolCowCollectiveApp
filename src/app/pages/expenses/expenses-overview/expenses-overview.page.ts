import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.page.html',
  styleUrls: ['./expenses-overview.page.scss'],
})
export class ExpensesOverviewPage implements OnInit {  

  constructor(private router: Router, private expensesService: ExpensesService) { }

  ngOnInit() {
    this.expensesService.expenseRegistered.subscribe(newExpense => {
      if (newExpense) {
        if(newExpense.isRecurring){
          this.expensesService.loadExpensesList();
        }
        else{
          this.expensesService.expensesList.push(newExpense);
        }        

        //this.expensesService.computeTotals();
      }
    });

    this.expensesService.expenseDeleted.subscribe(expenseId => {
      if (expenseId) {
        let expenseToDelete = this.expensesService.expensesList.map(x => x.id).findIndex(x => x == expenseId);
        this.expensesService.loadExpensesList();
        //this.expensesService.expensesList.splice(expenseToDelete, 1);
        //this.expensesService.computeTotals();
      }
    });

    this.expensesService.expenseUpdated.subscribe(sale => {
      if (sale) {
        let expenseToUpdate = this.expensesService.expensesList.map(x => x.id).findIndex(x => x == sale.id);
        this.expensesService.expensesList[expenseToUpdate] = sale;
        if(sale.isRecurring){          
          this.expensesService.loadExpensesList();
          // this.expensesService.expensesList.forEach(x => {
          //   if(x.id != sale.id && x.isRecurring && x.recurringId == sale.recurringId){
          //     x.isRecurring = false;
          //   }
          // });
        }
        
        //this.expensesService.computeTotals();
      }
    });  
  }

  openExpenseRecord(expenseId){
    let index = this.expensesService.expensesList.map(x => x.id).findIndex(x => x == expenseId);
    let navigationExtras: NavigationExtras = {
      state: {
        expenseDetails: this.expensesService.expensesList[index]
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
