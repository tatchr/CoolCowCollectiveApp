import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'feed-expense-form',
  templateUrl: './feed-expense.component.html',
  styleUrls: ['./feed-expense.component.scss'],  
})
export class FeedExpenseComponent implements OnInit {

  @Input() form: FormGroup;

  constructor(public service: ExpensesService) { }

  ngOnInit() {}
}
