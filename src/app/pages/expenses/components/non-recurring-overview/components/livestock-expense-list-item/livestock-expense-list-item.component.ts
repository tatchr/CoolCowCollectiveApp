import { Component, OnInit, Input } from '@angular/core';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';

@Component({
  selector: 'livestock-expense-list-item',
  templateUrl: './livestock-expense-list-item.component.html',
  styleUrls: ['./livestock-expense-list-item.component.scss'],
})
export class LivestockExpenseListItemComponent implements OnInit {

  @Input() expense: LivestockExpensesDetails;
  
  constructor() { }

  ngOnInit() { }
}
