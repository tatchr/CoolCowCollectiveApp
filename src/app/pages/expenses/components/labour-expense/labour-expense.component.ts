import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'labour-expense-form',
  templateUrl: './labour-expense.component.html',
  styleUrls: ['./labour-expense.component.scss'],
})
export class LabourExpenseComponent implements OnInit {

  @Input() form: FormGroup;
  
  constructor(private service: ExpensesService) { }

  ngOnInit() {
    this.form.controls['quantityUnit'].setValue('hours');    
  }

}
