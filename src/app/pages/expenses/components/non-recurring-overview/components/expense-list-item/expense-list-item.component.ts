import { Component, OnInit, Input } from '@angular/core';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'expense-list-item',
  templateUrl: './expense-list-item.component.html',
  styleUrls: ['./expense-list-item.component.scss'],
})
export class ExpenseListItemComponent implements OnInit {

  @Input() expense: ExpensesDetails;

  constructor() { }

  ngOnInit() {}
}
