import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { MathService } from 'src/app/services/math/math.service';

@Component({
  selector: 'medicine-expense-form',
  templateUrl: './medicine-expense.component.html',
  styleUrls: ['./medicine-expense.component.scss'],
})
export class MedicineExpenseComponent implements OnInit {

  @Input() date: string;
  @Input() expensesDetails: ExpensesDetails;
  @Output() returnform = new EventEmitter<FormGroup>();

  protected form: FormGroup;
  
  constructor(public expensesService: ExpensesService, private math: MathService) { }

  ngOnInit() {
    this.form = this.expensesService.newForm(this.expensesDetails); 

    this.form.valueChanges.subscribe(val => {
      let totalprice = this.math.round(val['price'] * val['quantity'], 2);
      this.form.get('totalprice').patchValue(totalprice, { emitEvent: false });
    });

    this.form.get('recurringisactive').valueChanges.subscribe((isActive: boolean) => {
      if(isActive){
        this.form.addControl('recurringperiodindays', new FormControl(null, [Validators.required]));
      }
      else{
        this.form.removeControl('recurringperiodindays');
      }
    });
  }

  protected emitform(form: FormGroup){
    form.get('date').setValue(this.date);
    this.returnform.emit(form);
  }
}
