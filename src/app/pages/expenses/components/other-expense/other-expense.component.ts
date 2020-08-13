import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'other-expense-form',
  templateUrl: './other-expense.component.html',
  styleUrls: ['./other-expense.component.scss'],
})
export class OtherExpenseComponent implements OnInit {

  @Input() form: FormGroup;
  
  constructor() { }

  ngOnInit() {}

}
