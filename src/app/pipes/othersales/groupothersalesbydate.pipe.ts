import { Pipe, PipeTransform } from '@angular/core';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { OtherSalesGroup } from 'src/app/common/objects/OtherSalesGroup';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

@Pipe({
  name: 'groupothersalesbydate'
})
export class GroupothersalesbydatePipe implements PipeTransform {

  transform(allOtherSales: Array<OtherSalesDetails>, args?: any): any {
    let milkSalesGroup: Array<OtherSalesGroup> = [];

    from(allOtherSales).pipe(
        groupBy(item => item.date),
        mergeMap(group => group.pipe(toArray()))
      )
      .forEach(x => milkSalesGroup.push(new OtherSalesGroup({date: x[0].date, otherSalesList: x})));      

    return milkSalesGroup;
  }

}
