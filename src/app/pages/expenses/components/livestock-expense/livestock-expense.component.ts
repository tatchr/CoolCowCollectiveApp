import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'livestock-expense-form',
  templateUrl: './livestock-expense.component.html',
  styleUrls: ['./livestock-expense.component.scss'],
})
export class LivestockExpenseComponent implements OnInit {

  @Input() form: FormGroup;
  
  constructor(private service: ExpensesService) { }

  ngOnInit() {
    //this.form.controls['quantity'].setValue(1);
  }

}
