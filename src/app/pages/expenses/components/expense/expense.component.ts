import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Component({
  selector: 'expense-form',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  @Input() type: string;
  @Input() date: string;
  @Input() expensesDetails: ExpensesDetails;
  @Output() returnform = new EventEmitter<FormGroup>();

  protected expensesForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.expensesForm = this.createForm(this.expensesDetails);

    this.expensesForm.valueChanges.subscribe(val => {
      let totalprice = this.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalprice').patchValue(totalprice, { emitEvent: false });
    });

    this.expensesForm.get('recurringisactive').valueChanges.subscribe((isActive: boolean) => {
      if(isActive){
        this.expensesForm.addControl('recurringperiodindays', new FormControl(null, [Validators.required]));
      }
      else{
        this.expensesForm.removeControl('recurringperiodindays');
      }
    })
  }

  private createForm(expense: ExpensesDetails){
    return this.formBuilder.group({
      id: [expense.id],
      farmId: [expense.farmId],
      date: [this.date],
      type: [this.type],
      itembought: [expense.itemBought, [Validators.required]],
      price: [expense.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [expense.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [expense.quantityUnit],
      totalprice: [{ value: 0.0, disabled: true }],
      cowname: [null],
      cowstatus: [null],
      sellername: [expense.sellerName],
      sellercompany: [expense.sellerCompany],
      recurringisactive: [expense.recurringIsActive],
      recurringFromDate: [expense.recurringFromDate]
    });
  }

  protected emitform(form: FormGroup){
    this.returnform.emit(form);
  }

  private round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
