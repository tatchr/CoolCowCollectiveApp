import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'feed-expense-form',
  templateUrl: './feed-expense.component.html',
  styleUrls: ['./feed-expense.component.scss'],  
})
export class FeedExpenseComponent implements OnInit {

  @Input() date: string;
  @Input() isExistingRecord: Boolean;
  @Input() expensesDetails: ExpensesDetails;
  @Output() returnForm = new EventEmitter<FormGroup>();
  @Output() deleteRecord = new EventEmitter<ExpensesDetails>();

  form: FormGroup;

  constructor(public expensesService: ExpensesService) { }

  ngOnInit() {
    this.form = this.expensesService.newForm(this.expensesDetails);
  }  

  emitForm(form: FormGroup){
    form.get('date').setValue(this.date);
    this.returnForm.emit(form);
  }

  delete(expensesDetails: ExpensesDetails){
    this.deleteRecord.emit(expensesDetails);
  }

  get isExistingRootRecord(){
    return this.isExistingRecord && this.recurringId;
  }

  get isRecurringRecord(){
    return this.recurringId && !this.isRootRecord;
  }

  get isRootRecord(){
    return this.form.get('isrootrecord').value;
  }

  get recurringId(){
    return this.form.get('recurringid').value;
  }

  get recurringIsActive(){    
    return this.form.get('recurringisactive').value;
  }
}
