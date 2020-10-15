import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'labour-expense-form',
  templateUrl: './labour-expense.component.html',
  styleUrls: ['./labour-expense.component.scss'],
})
export class LabourExpenseComponent implements OnInit {

  @Input() date: string;
  @Input() isExistingRecord: Boolean;
  @Input() expensesDetails: ExpensesDetails;
  @Output() returnForm = new EventEmitter<FormGroup>();
  @Output() deleteRecord = new EventEmitter<ExpensesDetails>();

  protected form: FormGroup;

  constructor(public expensesService: ExpensesService) { }

  ngOnInit() {
    this.form = this.expensesService.newForm(this.expensesDetails); 
    this.form.get('quantityUnit').setValue('hours');
  }

  protected emitForm(form: FormGroup){
    form.get('date').setValue(this.date);
    let employeeName = this.form.get('itembought').value;
    form.get('sellername').setValue(employeeName);
    form.get('sellercompany').setValue(employeeName);

    this.returnForm.emit(form);
  }

  protected delete(expensesDetails: ExpensesDetails){
    this.deleteRecord.emit(expensesDetails);
  }

  protected get isExistingRootRecord(){
    return this.isExistingRecord && this.recurringId && this.recurringId;
  }

  protected get isRecurringRecord(){
    return this.recurringId && !this.isRootRecord;
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
