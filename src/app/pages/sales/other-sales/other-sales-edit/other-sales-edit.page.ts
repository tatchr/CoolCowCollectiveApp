import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

@Component({
  selector: 'app-other-sales-edit',
  templateUrl: './other-sales-edit.page.html',
  styleUrls: ['./other-sales-edit.page.scss'],
})
export class OtherSalesEditPage extends OtherSalesBaseComponent implements OnInit {

  cowSold: CowDetails;

  otherSaleDetails: OtherSalesDetails;
  cowsList: Array<CowDetails> = [];

  constructor(router: Router, private activatedRoute: ActivatedRoute, formBuilder: FormBuilder, 
    salesService: SalesService, cowService: CowService, datePicker: DatepickerService, storage: Storage, private alertService: AlertService) {
      super(router, salesService, cowService, formBuilder, storage, datePicker);

      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.otherSaleDetails = this.router.getCurrentNavigation().extras.state.otherSaleDetails;
          this.cowsList = this.router.getCurrentNavigation().extras.state.cowsList;
        }
      });
     }

  ngOnInit() {
    this.selectedDateString = this.datePicker.formatDate(this.otherSaleDetails.date);

    this.othersalesForm = this.formBuilder.group({
      id: this.otherSaleDetails.id,
      farmId: this.otherSaleDetails.farmId,
      date: this.otherSaleDetails.date,
      itemsold: [{value: this.getItemSold(this.otherSaleDetails), disabled: true}],
      cowidsold: [{value: this.otherSaleDetails.cowIdSold, disabled: true}],
      price: [this.otherSaleDetails.price, [Validators.required, Validators.min(0.0)]],
      quantity: [this.otherSaleDetails.quantity, [Validators.min(0.0), Validators.max(100000.00)]],
      offtakername: [this.otherSaleDetails.offtakerName],
      offtakercompany: [this.otherSaleDetails.offtakerCompany],
    });
  }  


  getItemSold(otherSalesDetails){
    this.showSpermInput = otherSalesDetails.itemSold == 'Sperm';
    this.showCowList = this.animalTypes.includes(otherSalesDetails.itemSold); 

    if(this.showCowList){
      this.getCow(otherSalesDetails.cowIdSold);
      return otherSalesDetails.itemSold
    }

    if(!this.animalTypes.includes(otherSalesDetails.itemSold) && !this.showSpermInput){
      this.showOtherInput = true;
      this.otherItemDescription = otherSalesDetails.itemSold;
      return 'Other';
    }    

    return otherSalesDetails.itemSold;
  } 
  
  getCow(cowId){
    let index = this.cowsList.map(x => x.id).findIndex(x => x == cowId);
    this.cowSold = this.cowsList[index];


    //this.cowService.getCow(cowId).then(res => {
      //this.cowSold = res['cow'];
      //this.cowService.cowListState.next(false);
    //});
  }  

  onSubmit() {
    if(this.othersalesForm.valid){
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);
      
      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      let updatedSale = new OtherSalesDetails({
        id: this.othersalesForm.value['id'],
        farmId: this.othersalesForm.value['farmId'],
        date: this.othersalesForm.value['date'],
        itemSold: this.othersalesForm.get(['itemsold']).value,
        cowIdSold: this.othersalesForm.get(['cowidsold']).value,
        price: this.othersalesForm.value['price'],
        quantity: this.othersalesForm.value['quantity'],
        offtakerName: this.othersalesForm.value['offtakername'],
        offtakerCompany: this.othersalesForm.value['offtakercompany']
      });

      this.salesService.updateOtherSalesRecord(this.othersalesForm.getRawValue()).subscribe(val => {
        if(val){
          this.salesService.otherSaleUpdated.next(updatedSale);
          this.router.navigateByUrl('/tabs/other-sales-overview');
        }
      });
    }    
  }

  onDelete(){
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this sales record?';
    let confirmAction = () => { 
      this.salesService.deleteOtherSalesRecord(this.otherSaleDetails.id).subscribe(val => {
        if(val){
          this.salesService.otherSaleDeleted.next(this.otherSaleDetails.id);
          this.router.navigateByUrl('/tabs/other-sales-overview');
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
