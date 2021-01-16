import { Injectable } from '@angular/core';
import { DatepickerService } from '../datepicker/datepicker.service';
import { ExpensesService } from '../expenses/expenses.service';
import { from, of, zip } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';
import { MilkService } from '../milk/milk.service';
import { MilkProductionDetails } from 'src/app/common/objects/MilkProductionDetails';
import { MilkPartOfDayGroup } from 'src/app/common/objects/groups/MilkPartOfDayGroup';
import { MilkTotals } from 'src/app/common/objects/MilkTotals';
import { MilkProductionChartData } from 'src/app/common/objects/charts/milk-production/MilkProductionChartData';
import { CowChartData } from 'src/app/common/objects/charts/cows/CowChartData';
import { MathService } from '../math/math.service';
import { CowService } from '../cow/cow.service';
import { CowState, CowStatus } from 'src/app/common/objects/Enums';
import { MilksalesService } from '../sales/milksales/milksales.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';

@Injectable({
  providedIn: 'root'
})
export class FarmDashboardDataService {

  constructor(private expensesService: ExpensesService, private milkService: MilkService, 
    public datePicker: DatepickerService, private math: MathService, private cowService: CowService,
    private milksSalesService: MilksalesService) { }

  public getTotalExpenses(fromDate: string, toDate: string){
    let records = this.expensesService.expensesList.filter((expensesRecord: ExpensesDetails) => {
      return this.datePicker.isBetween(expensesRecord.date, fromDate, toDate);
    });

    let nonRecurringTotal = records.reduce((a,b) => a + b.price, 0);
    let recurringTotal = this.expensesService.recurringExpensesList.reduce((a,b) => a + b.totalPrice, 0);

    return nonRecurringTotal + recurringTotal;
  }
  
  getHerdSize(){
    return this.cowService.cowsList
      .filter(cow => cow.cowState == CowState.InHerd)
      .length;
  }

  getLactatingCows(){
    return this.cowService.cowsList
      .filter(cow => cow.cowStatus == CowStatus.Lactating)
      .length;
  }

  getAverageMilk(fromDate: string, toDate: string){
    let records = this.milkService.allMilkRecordsList.filter((milkRecord: MilkProductionDetails) => {
      return this.datePicker.isBetween(milkRecord.date, fromDate, toDate);
    });

    if(records.length < 1) return 0;

    return records.reduce((a,b) => a + b.amount, 0) / records.length;
  }

  getTotalMilkProduced(fromDate: string, toDate: string){
    let records = this.milkService.allMilkRecordsList.filter((milkRecord: MilkProductionDetails) => {
      return this.datePicker.isBetween(milkRecord.date, fromDate, toDate);
    });

    if(records.length < 1) return 0;

    return records.reduce((a,b) => a + b.amount, 0);
  }

  getTotalMilkSold(fromDate: string, toDate: string){
    let records = this.milksSalesService.milkSalesList.filter((milkSale: MilkSalesDetails) => {
      return this.datePicker.isBetween(milkSale.date, fromDate, toDate);
    });

    if(records.length < 1) return 0;

    return records.reduce((a,b) => a + (b.litersSold * b.pricePerLiter), 0);
  }
  
  getCowData(fromDate: string, toDate: string): CowChartData[]{
    let result: CowChartData[] = [];

    from(this.milkService.allMilkRecordsList).pipe(
      filter((milkRecord: MilkProductionDetails) => 
        this.datePicker.isBetween(milkRecord.date, fromDate, toDate)
      ),
      groupBy(milkRecord => milkRecord.cowName),
      mergeMap(group => zip(
        of(group.key),
        group.pipe(
          reduce(
            (total, milkProductionDetail) => this.math.round(total + milkProductionDetail.amount, 1), 0)
          )
        )
        .pipe(
          map(
            ([cowName, totalMilk]) => new CowChartData(cowName, totalMilk)
          )
        )
      ),
      toArray()
    )
    .subscribe(cowData => {
      result = cowData
        .sort((a, b) => b.totalMilk - a.totalMilk)
        .slice(0, 3);
    })

    return result;
  }
  
  getMilkProductionData(fromDate: string, toDate: string): MilkProductionChartData{
    let days = this.datePicker.getDaysArray(fromDate, toDate);
    let result: MilkProductionChartData; 

    from(this.milkService.allMilkRecordsList).pipe(
      filter((milkRecord: MilkProductionDetails) => 
        this.datePicker.isBetween(milkRecord.date, fromDate, toDate)
      ),
      groupBy((milkRecord: MilkProductionDetails) => milkRecord.partOfDay),
      mergeMap(group => zip(
        of(group.key), 
        group.pipe(toArray()) 
        )
        .pipe(
          map(
            ([key, value]) => new MilkPartOfDayGroup({
              partOfDay: key,
              days: days,
              milkTotals: this.getMilkTotals(fromDate, toDate, value)})
          )
        )
      ),
      toArray()
    )
    .subscribe(milkData => {
      result = new MilkProductionChartData(days, milkData)
    });
    
    return result;
  }

  private getMilkTotals(fromDate, toDate, arr: MilkProductionDetails[]){
    let days: string[] = this.datePicker.getDaysArray(fromDate, toDate);
    let milkTotals: MilkTotals[] = [];
    
    days.forEach(day => {
      let milkOnDay = arr.filter(x => this.datePicker.formatDate2(x.date, 'MMM-DD') == day);

      if (milkOnDay.length == 0) {
        milkTotals.push(new MilkTotals(day, Number.NaN));
      }
      else {
        let milkSumOnDay = milkOnDay.reduce((a, b) => a + b.amount, 0);
        milkTotals.push(new MilkTotals(day, milkSumOnDay));
      }
    });

    return milkTotals;
  }

  getExpensesData(fromDate: string, toDate: string){
    let result: ExpensesTypeGroup[] = [];

    from(this.expensesService.expensesList).pipe(
      filter((expense: IExpensesDetails) =>
        this.datePicker.isBetween(expense.date, fromDate, toDate)
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
      ),
      toArray()     
    )
    .subscribe(expenseData => {
      result = expenseData;
    })

    return result;
  }
}


