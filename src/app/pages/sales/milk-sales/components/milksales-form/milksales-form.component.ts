import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

@Component({
  selector: 'milksales-form',
  templateUrl: './milksales-form.component.html',
  styleUrls: ['./milksales-form.component.scss'],
})
export class MilksalesFormComponent implements OnInit {
  @Input() selectedDate: string;
  @Input() isExistingRecord: boolean;
  @Input() milksalesDetails: MilkSalesDetails;
  @Output() returnform = new EventEmitter<FormGroup>();
  @Output() delete = new EventEmitter<string>();

  milksalesForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.milksalesForm = this.createForm(this.milksalesDetails);
  }

  private createForm(milkSale: MilkSalesDetails){
    let form = this.formBuilder.group({
      farmId: [milkSale.farmId],
      date: [this.getDate(milkSale)],
      literssold: [milkSale.litersSold, [Validators.required, Validators.min(0.0), Validators.max(1000.0)]],
      priceperliter: [milkSale.pricePerLiter, [Validators.required, Validators.min(0.0), Validators.max(999.99)]],
      totalPrice: new FormControl({ value: 0.0, disabled: true }),
      offtaker: [milkSale.offtaker, [Validators.required]],
      offtakername: [milkSale.offtakerName],
      fullamountpaid: [milkSale.fullAmountPaid]
    });

    form.valueChanges.subscribe(value => {
      let totalPrice = this.round(value['literssold'] * value['priceperliter'], 2);
      form.get('totalPrice').patchValue(totalPrice, { emitEvent: false });
    });

    if(milkSale.id){
      form.addControl('id', new FormControl(milkSale.id));
    }

    return form;
  }

  emitform(date: string, form: FormGroup){
    form.get('date').setValue(date);

    this.returnform.emit(form);
  }

  deleterecord(form: FormGroup){
    let milksaleId = form.get('id').value;

    this.delete.emit(milksaleId);
  }

  private getDate(milkSale: MilkSalesDetails): string{
    if(milkSale.date) return milkSale.date;
    
    return this.selectedDate;
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

}
