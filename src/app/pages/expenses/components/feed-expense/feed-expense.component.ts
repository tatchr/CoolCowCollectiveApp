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
  @Output() deleteRecord = new EventEmitter<string>();

  protected form: FormGroup;

  constructor(public expensesService: ExpensesService) { }

  ngOnInit() {
    this.form = this.expensesService.newForm(this.expensesDetails);
  }  

  protected emitForm(form: FormGroup){
    form.get('date').setValue(this.date);
    this.returnForm.emit(form);
  }

  protected delete(id: string){
    this.deleteRecord.emit(id);
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
