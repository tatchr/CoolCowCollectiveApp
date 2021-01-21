import { Injectable } from '@angular/core';
import { CowService } from '../cow/cow.service';
import { ExpensesService } from '../expenses/expenses.service';
import { MilkService } from '../milk/milk.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private milkService: MilkService, private expensesService: ExpensesService, private cowService: CowService) { }

  loadAllData(fromDate, toDate){
    //return this.cowService.loadCows();

    //this.milkService.loadAllMilkRecordsList(fromDate, toDate);
    //this.expensesService.loadExpensesList(fromDate, toDate);
    //this.cowService.loadCowsList();
  }
}
