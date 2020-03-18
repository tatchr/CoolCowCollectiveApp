import { Pipe, PipeTransform } from '@angular/core';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { MilkSalesGroup } from 'src/app/common/objects/MilkSalesGroup';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

@Pipe({
  name: 'groupmilksalesbydate'
})
export class GroupmilksalesbydatePipe implements PipeTransform {

  transform(allMilkSales: Array<MilkSalesDetails>, args?: any): any {
    let milkSalesGroup: Array<MilkSalesGroup> = [];

    from(allMilkSales).pipe(
        groupBy(item => item.date),
        mergeMap(group => group.pipe(toArray()))
      )
      .forEach(x => milkSalesGroup.push(new MilkSalesGroup({date: x[0].date, milkSalesList: x})));      

    return milkSalesGroup;
  }

}
