import { Component, OnInit, Input } from '@angular/core';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

@Component({
  selector: 'livestock-expense-list-item',
  templateUrl: './livestock-expense-list-item.component.html',
  styleUrls: ['./livestock-expense-list-item.component.scss'],
})
export class LivestockExpenseListItemComponent implements OnInit {

  @Input() expense: IExpensesDetails;
  
  constructor() { }

  ngOnInit() { }
}
