import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';

@Component({
  selector: 'app-other-sales-edit',
  templateUrl: './other-sales-edit.page.html',
  styleUrls: ['./other-sales-edit.page.scss'],
})
export class OtherSalesEditPage extends OtherSalesBaseComponent implements OnInit {

  otherSaleId: string;
  cowSold: CowDetails;

  constructor(router: Router, private activatedRoute: ActivatedRoute, formBuilder: FormBuilder, 
    salesService: SalesService, cowService: CowService, datePicker: DatepickerService, storage: Storage, private alertService: AlertService) {
      super(router, salesService, cowService, formBuilder, storage, datePicker);
     }

  ngOnInit() {
    this.initiate();
  }
  
  initiate() {
    this.otherSaleId = this.activatedRoute.snapshot.paramMap.get('otherSaleId');
    this.getFarmId();
    this.getOtherSale();   
  }  

  getOtherSale(){
    this.salesService.getOtherSaleRecord(this.otherSaleId).subscribe(res => {
      this.populateForm(res['otherSale']);      
    });
  }

  populateForm(otherSalesDetails){
    this.selectedDateString = this.datePicker.formatDate(otherSalesDetails.date);

    this.othersalesForm = this.formBuilder.group({
      id: this.otherSaleId,
      farmId: this.farmId,
      date: this.selectedDateString,
      itemsold: [{value: this.getItemSold(otherSalesDetails), disabled: true}],
      cowidsold: [{value: otherSalesDetails.cowIdSold, disabled: true}],
      price: [otherSalesDetails.price, [Validators.required, Validators.min(0.0)]],
      quantity: [otherSalesDetails.quantity, [Validators.min(0.0), Validators.max(100000.00)]],
      offtakername: [otherSalesDetails.offtakerName],
      offtakercompany: [otherSalesDetails.offtakerCompany],
    });
  }

  getItemSold(otherSalesDetails){
    this.showSpermInput = otherSalesDetails.itemSold == 'Sperm';
    this.showCowList = this.animalTypes.includes(otherSalesDetails.itemSold); 

    if(this.showCowList){
      this.loadCow(otherSalesDetails.cowIdSold);
      return otherSalesDetails.itemSold
    }

    if(!this.animalTypes.includes(otherSalesDetails.itemSold) && !this.showSpermInput){
      this.showOtherInput = true;
      this.otherItemDescription = otherSalesDetails.itemSold;
      return 'Other';
    }    

    return otherSalesDetails.itemSold;
  } 
  
  loadCow(cowId){
    this.cowService.getCow(cowId).subscribe(res => {
      console.log(res['cow']);
      this.cowSold = res['cow'];
      this.cowService.cowListState.next(false);
    });
  }  

  onSubmit() {
    if(this.othersalesForm.valid){
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);
      
      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.salesService.updateOtherSalesRecord(this.othersalesForm.getRawValue()).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    }    
  }

  onDelete(){
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this sales record?';
    let confirmAction = () => { 
      this.salesService.deleteOtherSalesRecord(this.otherSaleId).subscribe(val => {
        if(val){
          this.returnToOverview();
        }
      });
    };    
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

  returnToOverview(){
    this.salesService.otherSalesListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }
}
