import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'medicine-expense-form',
  templateUrl: './medicine-expense.component.html',
  styleUrls: ['./medicine-expense.component.scss'],
})
export class MedicineExpenseComponent implements OnInit {

  @Input() form: FormGroup;
  
  constructor(public service: ExpensesService) { }

  ngOnInit() {
    
  }

}
