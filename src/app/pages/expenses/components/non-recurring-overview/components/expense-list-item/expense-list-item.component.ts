import { Component, OnInit, Input } from '@angular/core';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

@Component({
  selector: 'expense-list-item',
  templateUrl: './expense-list-item.component.html',
  styleUrls: ['./expense-list-item.component.scss'],
})
export class ExpenseListItemComponent implements OnInit {

  @Input() expense: IExpensesDetails;

  constructor() { }

  ngOnInit() {}
}
