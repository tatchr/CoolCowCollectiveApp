import { Pipe, PipeTransform } from '@angular/core';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesGroup } from 'src/app/common/objects/ExpensesGroup';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';

@Pipe({
  name: 'groupexpensesbydate'
})
export class GroupexpensesbydatePipe implements PipeTransform {

  transform(allExpenses: Array<ExpensesDetails>, allLivestockExpenses: Array<LivestockExpensesDetails>, args?: any): any {
    let expensesGroup: Array<ExpensesGroup> = [];
    let result: Array<ExpensesGroup> = [];

    from(allExpenses).pipe(
        groupBy(item => item.date),
        mergeMap(group => group.pipe(toArray()))        
      )
      .forEach(expensesDetailsArray => expensesGroup.push(new ExpensesGroup({date: expensesDetailsArray[0].date, expensesList: expensesDetailsArray})));  
    
    from(allLivestockExpenses).pipe(
      groupBy(item => item.date),
      mergeMap(group => group.pipe(toArray()))
    )
    .forEach(livestockExpensesDetailsArray => {
      let index = expensesGroup.findIndex(expensesGroup => expensesGroup.date.toString() == livestockExpensesDetailsArray[0].date);
      if(index > -1){
        expensesGroup[index].livestockExpensesList = livestockExpensesDetailsArray;
      }
      else{
        expensesGroup.push(new ExpensesGroup({date: livestockExpensesDetailsArray[0].date, livestockExpensesList: livestockExpensesDetailsArray}))
      }
    });

    return expensesGroup.sort((a, b) => Math.abs(<any>b.date - <any>a.date));
  }

}
