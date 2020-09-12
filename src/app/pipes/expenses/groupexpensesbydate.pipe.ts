import { Pipe, PipeTransform } from '@angular/core';
import { ExpensesGroup } from 'src/app/common/objects/ExpensesGroup';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

@Pipe({
  name: 'groupexpensesbydate'
})
export class GroupexpensesbydatePipe implements PipeTransform {

  transform(allExpenses: Array<IExpensesDetails>, args?: any): any {
    let expensesGroup: Array<ExpensesGroup> = [];

    from(allExpenses).pipe(
        groupBy(item => item.date),
        mergeMap(group => group.pipe(toArray()))        
      )
      .forEach(expensesDetailsArray => expensesGroup.push(new ExpensesGroup({
        date: expensesDetailsArray[0].date, 
        expensesList: expensesDetailsArray
      })));

    return expensesGroup.sort((a, b) => Math.abs(<any>b.date - <any>a.date));
  }

}
