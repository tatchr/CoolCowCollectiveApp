import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { ItemSold } from 'src/app/common/objects/Enums';

@Component({
  selector: 'app-other-sales-edit',
  templateUrl: './other-sales-edit.page.html',
  styleUrls: ['./other-sales-edit.page.scss'],
})
export class OtherSalesEditPage implements OnInit {

  cowSold: CowDetails;
  othersalesDetails: OtherSalesDetails;
  selectedDate: string = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
    private otherSalesService: OthersalesService, private cowService: CowService, private storage: Storage, private alertService: AlertService) {    
      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          let sale = this.router.getCurrentNavigation().extras.state.otherSaleDetails;
          this.selectedDate = this.otherSalesService.datePicker.formatDate(sale.date);
          this.othersalesDetails = sale;
        }
      });    
  }

  async openDatePicker() {
    this.selectedDate = await this.otherSalesService.datePicker.openDatePicker(this.selectedDate);
  } 

  ngOnInit() {
    
    

    console.log(this.othersalesDetails);
    //this.selectedDate = this.otherSalesService.datePicker.formatDate(this.othersalesDetails.date);
    console.log(this.selectedDate);


    // this.othersalesForm = this.formBuilder.group({
    //   id: this.otherSaleDetails.id,
    //   farmId: this.otherSaleDetails.farmId,
    //   date: this.otherSaleDetails.date,
    //   itemsold: [{ value: this.getItemSold(this.otherSaleDetails), disabled: true }],
    //   cowidsold: [{ value: this.otherSaleDetails.cowIdSold, disabled: true }],
    //   price: [this.otherSaleDetails.price, [Validators.required, Validators.min(0.0), Validators.max(999999.99)]],
    //   quantity: [this.otherSaleDetails.quantity, [Validators.min(0.0), Validators.max(100000.00)]],
    //   offtakername: [this.otherSaleDetails.offtakerName],
    //   offtakercompany: [this.otherSaleDetails.offtakerCompany],
    // });
  }

  // getItemSold(otherSalesDetails: OtherSalesDetails): string {
  //   this.showSpermInput = otherSalesDetails.itemSold == ItemSold.Sperm;
  //   this.showCowList = this.cowService.animalTypes.includes(otherSalesDetails.itemSold);

  //   if (this.showCowList) {
  //     this.cowSold = this.cowService.getCow(otherSalesDetails.cowIdSold);

  //     return otherSalesDetails.itemSold
  //   }

  //   if (!this.cowService.animalTypes.includes(otherSalesDetails.itemSold) && !this.showSpermInput) {
  //     this.showOtherInput = true;
  //     this.otherItemDescription = otherSalesDetails.itemSold;

  //     return ItemSold.Other;
  //   }

  //   return otherSalesDetails.itemSold;
  // }

  onSubmit(othersalesForm) {
    console.log(othersalesForm);
    // if (this.othersalesForm.valid) {
    //   this.othersalesForm.controls['date'].setValue(this.selectedDate);

    //   let itemsold = this.othersalesForm.controls['itemsold'].value;
    //   if (itemsold == ItemSold.Other) {
    //     this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
    //   }

    //   let updatedSale = new OtherSalesDetails({
    //     id: this.othersalesForm.value['id'],
    //     farmId: this.othersalesForm.value['farmId'],
    //     date: this.othersalesForm.value['date'],
    //     itemSold: this.othersalesForm.get(['itemsold']).value,
    //     cowIdSold: this.othersalesForm.get(['cowidsold']).value,
    //     price: this.othersalesForm.value['price'],
    //     quantity: this.othersalesForm.value['quantity'],
    //     offtakerName: this.othersalesForm.value['offtakername'],
    //     offtakerCompany: this.othersalesForm.value['offtakercompany']
    //   });

    //   this.otherSalesService.updateOtherSalesRecord(this.othersalesForm.getRawValue()).subscribe(val => {
    //     if (val) {
    //       this.otherSalesService.otherSaleUpdated.next(updatedSale);
    //       this.returnToOverview();
    //     }
    //   });
    // }
  }

  // onSubmit() {
  //   if (this.othersalesForm.valid) {
  //     this.othersalesForm.controls['date'].setValue(this.selectedDate);

  //     let itemsold = this.othersalesForm.controls['itemsold'].value;
  //     if (itemsold == ItemSold.Other) {
  //       this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
  //     }

  //     let updatedSale = new OtherSalesDetails({
  //       id: this.othersalesForm.value['id'],
  //       farmId: this.othersalesForm.value['farmId'],
  //       date: this.othersalesForm.value['date'],
  //       itemSold: this.othersalesForm.get(['itemsold']).value,
  //       cowIdSold: this.othersalesForm.get(['cowidsold']).value,
  //       price: this.othersalesForm.value['price'],
  //       quantity: this.othersalesForm.value['quantity'],
  //       offtakerName: this.othersalesForm.value['offtakername'],
  //       offtakerCompany: this.othersalesForm.value['offtakercompany']
  //     });

  //     this.otherSalesService.updateOtherSalesRecord(this.othersalesForm.getRawValue()).subscribe(val => {
  //       if (val) {
  //         this.otherSalesService.otherSaleUpdated.next(updatedSale);
  //         this.returnToOverview();
  //       }
  //     });
  //   }
  // }

  // onDelete() {
  //   let header = 'Delete this record?';
  //   let message = 'Are you sure that you want to permanently delete this sales record?';
  //   let confirmAction = () => {
  //     this.otherSalesService.deleteOtherSalesRecord(this.otherSaleDetails.id).subscribe(val => {
  //       if (val) {
  //         this.otherSalesService.otherSaleDeleted.next(this.otherSaleDetails.id);
  //         this.returnToOverview();
  //       }
  //     });
  //   };
  //   this.alertService.presentAlertConfirm(header, message, confirmAction);
  // }
}
