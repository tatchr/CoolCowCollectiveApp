import { Injectable } from '@angular/core';
import { DatepickerService } from '../datepicker/datepicker.service';
import { ExpensesService } from '../expenses/expenses.service';
import { from, of, zip } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';
import { MilkService } from '../milk/milk.service';
import { TimeOfDay } from 'src/app/common/objects/Enums';
import { MilkProductionDetails } from 'src/app/common/objects/MilkProductionDetails';

@Injectable({
  providedIn: 'root'
})
export class FarmDashboardDataService {

  constructor(private expensesService: ExpensesService, private milkService: MilkService, 
    public datePicker: DatepickerService) { }

  public getMilkProductionData(fromDate: Date, toDate: Date){
    
    let timesOfDay: TimeOfDay[] = [TimeOfDay.Morning, TimeOfDay.Afternoon, TimeOfDay.Evening];

    let result = from(this.milkService.allMilkRecordsList).pipe(
      filter((milkRecord: MilkProductionDetails) => 
        this.datePicker.formatDate(milkRecord.date) >= this.datePicker.formatDate(fromDate) && 
        this.datePicker.formatDate(milkRecord.date) <= this.datePicker.formatDate(toDate)
      ),
      groupBy((milkRecord: MilkProductionDetails) => milkRecord.timeOfDay),
      mergeMap(group => zip(
        of(group.key), 
        group.pipe(toArray())
        )),
    );

    result.subscribe(x => console.log(x));
    // let milkRecords = this.milkService.allMilkRecordsList.filter(x => x.timeOfDay == timeOfDay);
    // let days: String[] = this.datePicker.getDaysArray(fromDate, toDate);

    let milkTotals = [];
    // days.forEach(day => {
    //   let milkOnDay = milkRecords.filter(x => this.datePicker.formatDate2(x.date, 'MMM-DD') == day);

    //   if (milkOnDay.length == 0) {
    //     milkTotals.push(Number.NaN);
    //   }
    //   else {
    //     let milkSumOnDay = milkOnDay.reduce((a, b) => a + b.amount, 0);
    //     milkTotals.push(milkSumOnDay);
    //   }
    // });

    return milkTotals;
  }

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
