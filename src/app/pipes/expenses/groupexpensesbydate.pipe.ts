import { Pipe, PipeTransform } from '@angular/core';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesGroup } from 'src/app/common/objects/ExpensesGroup';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

@Pipe({
  name: 'groupexpensesbydate'
})
export class GroupexpensesbydatePipe implements PipeTransform {

  transform(allExpenses: Array<ExpensesDetails>, args?: any): any {
    let expensesGroup: Array<ExpensesGroup> = [];

    from(allExpenses).pipe(
        groupBy(item => item.date),
        mergeMap(group => group.pipe(toArray()))
      )
      .forEach(x => expensesGroup.push(new ExpensesGroup({date: x[0].date, expensesList: x})));      

    return expensesGroup;
  }

}
