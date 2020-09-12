import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'other-expense-form',
  templateUrl: './other-expense.component.html',
  styleUrls: ['./other-expense.component.scss'],
})
export class OtherExpenseComponent implements OnInit {

  @Input() date: string;
  @Input() isExistingRecord: Boolean;
  @Input() expensesDetails: ExpensesDetails;
  @Output() returnForm = new EventEmitter<FormGroup>();
  @Output() deleteRecord = new EventEmitter<ExpensesDetails>();

  protected form: FormGroup;
  
  constructor(public expensesService: ExpensesService) { }

  ngOnInit() {
    this.form = this.expensesService.newForm(this.expensesDetails);
  }

  protected emitForm(form: FormGroup){
    form.get('date').setValue(this.date);
    this.returnForm.emit(form);
  }

  protected delete(expensesDetails: ExpensesDetails){
    this.deleteRecord.emit(expensesDetails);
  }

  protected get isExistingRootRecord(){
    return this.isExistingRecord && this.recurringId && this.recurringId;
  }

  protected get isRootRecord(){
    return this.form.get('isrootrecord').value;
  }

  protected get recurringId(){
    return this.form.get('recurringid').value;
  }

  protected get recurringIsActive(){    
    return this.form.get('recurringisactive').value;
  }
}
