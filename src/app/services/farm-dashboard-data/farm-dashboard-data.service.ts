import { Injectable } from '@angular/core';
import { DatepickerService } from '../datepicker/datepicker.service';
import { ExpensesService } from '../expenses/expenses.service';
import { from, of, zip } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce } from 'rxjs/operators';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';

@Injectable({
  providedIn: 'root'
})
export class FarmDashboardDataService {

  constructor(private expensesService: ExpensesService, public datePicker: DatepickerService) { }

  public getExpensesData(fromDate: Date, toDate: Date){
    let result: ExpensesTypeGroup[] = [];
    
    from(this.expensesService.expensesList).pipe(
      filter((expense: IExpensesDetails) =>
        this.datePicker.formatDate(expense.date) >= this.datePicker.formatDate(fromDate) && 
        this.datePicker.formatDate(expense.date) <= this.datePicker.formatDate(toDate)
      ),
      groupBy((expense: IExpensesDetails) => expense.type),
      mergeMap(group => zip(
          of(group.key), 
          group.pipe(reduce((total, expenseDetail) => total + expenseDetail.price, 0))
        )
        .pipe(
          map(
            ([key, value]) => new ExpensesTypeGroup({type: key, totalPrice: value})
          )
        )
      )      
    )
    .subscribe(expense => result.push(expense))

    return result;
  }
}
