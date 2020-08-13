import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { Animal, ItemSold } from 'src/app/common/objects/Enums';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { Router } from '@angular/router';
import { CowService } from 'src/app/services/cow/cow.service';

const cattleTypes: Array<string> = [Animal.Calf, Animal.Cow, Animal.Bull, Animal.Heifer];

@Component({
  selector: 'othersales-form',
  templateUrl: './othersales-form.component.html',
  styleUrls: ['./othersales-form.component.scss'],
})
export class OthersalesFormComponent implements OnInit {
  @Input() selectedDate: string;
  @Input() isExistingRecord: boolean;
  @Input() othersalesDetails: OtherSalesDetails;
  @Output() returnform = new EventEmitter<FormGroup>();
  @Output() delete = new EventEmitter<string>();

  protected othersalesForm: FormGroup;
  protected cattleSold: boolean;
  protected spermSold: boolean;
  protected otherSold: boolean;
  protected cattleList: Array<CowDetails> = [];  

  constructor(private cowService: CowService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.othersalesForm = this.createForm(this.othersalesDetails);
    this.setItemSold(this.othersalesDetails.itemSold);
    this.onFormChanges();
  }  

  private createForm(otherSales: OtherSalesDetails){
    return this.formBuilder.group({
      id: [otherSales.id],
      farmId: [otherSales.farmId],
      date: [this.getDate(otherSales)],
      itemsold: new FormControl({value: otherSales.itemSold, disabled: this.isExistingRecord}, [Validators.required, Validators.maxLength(150)]),
      itemdescription: new FormControl({ value: otherSales.itemDescription, disabled: otherSales.itemSold != ItemSold.Other }, [Validators.required, Validators.maxLength(150)]),
      cowidsold: new FormControl({value: otherSales.cowIdSold, disabled: otherSales.cowIdSold == null || this.isExistingRecord}, [Validators.required]),
      price: [otherSales.price, [Validators.required, Validators.min(0.0), Validators.max(100000.00)]],
      quantity: new FormControl({value: otherSales.quantity, disabled: (otherSales.itemSold != ItemSold.Sperm && otherSales.itemSold != ItemSold.Other)}, [Validators.required, Validators.max(100000.00)]),
      offtakername: [otherSales.offtakerName, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      offtakercompany: [otherSales.offtakerCompany],
    });
  }

  private getDate(otherSales: OtherSalesDetails): string{
    if(otherSales.date) return otherSales.date;
    
    return this.selectedDate;
  }

  protected emitform(date: string, form: FormGroup){
    form.get('date').setValue(date);

    this.returnform.emit(form);
  }

  protected deleterecord(form: FormGroup){
    let othersaleId = form.get('id').value;

    this.delete.emit(othersaleId);
  }

  protected get itemsold(){
    return this.othersalesForm.get('itemsold').value;
  }

  protected get cattle(){
    return this.cattleList;
  }

  protected set cattle(cattleList: Array<CowDetails>){
    this.cattleList = cattleList;
  }

  protected toCowRegistration(){
    this.router.navigateByUrl('/register-cow');
  }  

  private setItemSold(itemSold){
    this.spermSold = (itemSold == ItemSold.Sperm);
    this.otherSold = (itemSold == ItemSold.Other);
    this.cattleSold = cattleTypes.includes(itemSold);

    if(this.cattleSold && this.isExistingRecord){
      this.cattle = this.cowService.getCowsOfTypeSold(itemSold);
    }
  }

  private onFormChanges() {
    this.othersalesForm.get('itemsold').valueChanges.subscribe(val => {
      this.setItemSold(val);

      if(this.otherSold){
        this.othersalesForm.get('itemdescription').enable();
      }
      else{
        this.othersalesForm.get('itemdescription').disable();
      }

      if(this.otherSold || this.spermSold){
        this.othersalesForm.get('quantity').enable();
      }
      else{
        this.othersalesForm.get('quantity').disable();
      }
      
      if(this.cattleSold){
        this.cattle = this.cowService.getCowsOfTypeInHerd(val);
        if(this.cattle.length > 0){
          this.othersalesForm.get('cowidsold').enable();
        }
        else{
          this.othersalesForm.get('cowidsold').disable();
        }
      }
      else{
        this.othersalesForm.get('cowidsold').disable();
      }
    });
  }
}