import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';

@Component({
  selector: 'livestock-expense-form',
  templateUrl: './livestock-expense.component.html',
  styleUrls: ['./livestock-expense.component.scss'],
})
export class LivestockExpenseComponent implements OnInit {

  @Input() date: string;
  @Input() isExistingRecord: Boolean;
  @Input() livestockExpensesDetails: LivestockExpensesDetails;
  @Output() returnForm = new EventEmitter<FormGroup>();
  @Output() deleteRecord = new EventEmitter<LivestockExpensesDetails>();

  form: FormGroup;

  constructor(public expensesService: ExpensesService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.newForm(this.livestockExpensesDetails);
  }  

  emitForm(form: FormGroup){
    form.get('date').setValue(this.date);
    
    this.returnForm.emit(form);
  }

  delete(livestockExpensesDetails: LivestockExpensesDetails){
    this.deleteRecord.emit(livestockExpensesDetails);
  }

  private newForm(livestockExpense: LivestockExpensesDetails){
    return this.formBuilder.group({
      id: [livestockExpense.id],
      farmId: [livestockExpense.farmId],
      date: [this.date],
      cowdetails: this.formBuilder.group({
        farmId: livestockExpense.farmId,
        cowtype: [livestockExpense.cowDetails.cowType, [Validators.required]],
        name: [livestockExpense.cowDetails.name, [Validators.required, Validators.maxLength(50)]],
        cowstatus: [livestockExpense.cowDetails.cowStatus, [Validators.required]],
      }),      
      price: [livestockExpense.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],      
      sellername: [livestockExpense.sellerName],
      sellercompany: [livestockExpense.sellerCompany]
    });
  }
}
