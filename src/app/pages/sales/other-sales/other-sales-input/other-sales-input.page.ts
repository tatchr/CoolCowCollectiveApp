import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';
import { FilterService } from 'src/app/services/filter/filter.service';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { ItemSold, CowState } from 'src/app/common/objects/Enums';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage extends OtherSalesBaseComponent implements OnInit {
 
  disableSubmitBtn: boolean = false;
  cowSelector: Array<CowDetails> = [];
  
  constructor(router: Router, otherSalesService: OthersalesService, private activatedRoute: ActivatedRoute, cowService: CowService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService, private filterService: FilterService) { 
      super(router, otherSalesService, cowService, formBuilder, storage, datePicker);

      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          //this.cowService.cowsList = this.router.getCurrentNavigation().extras.state.cowsList;
        }
      });
    }

  ngOnInit() {    
    this.getFarmId();
    this.initiateForm();    
  }  

  initiateForm() {
    this.othersalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      itemsold: [null, [Validators.required]],
      cowidsold: [null],
      price: [null, [Validators.required, Validators.min(0.0), Validators.max(100000.00)]],
      quantity: [null, [Validators.max(100000.00)]],
      offtakername: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      offtakercompany: [null],
    });
  }

  onSubmit() {
    if (this.othersalesForm.valid) {
      this.othersalesForm.controls['farmId'].setValue(this.farmId);
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);

      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == ItemSold.Other){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.otherSalesService.registerOtherSalesRecord(this.othersalesForm.value).then(val => {
        if (val['otherSale']) {
          this.otherSalesService.otherSaleRegistered.next(val['otherSale']);
          this.router.navigateByUrl('/tabs/other-sales-overview');
        }
      });
    }
  }

  itemSelected(event) {
    this.showOtherInput = event.detail.value == ItemSold.Other;
    this.showSpermInput = event.detail.value == ItemSold.Sperm;
    this.showCowList = this.cowService.animalTypes.includes(event.detail.value);
    if (this.showCowList) {
      this.loadCowsList(event.detail.value);
    }
  }  

  loadCowsList(cowType) {
    let cowsByType = this.filterService.applyFilters(this.cowService.cowsList, [cowType], 'cowType');
    this.cowSelector = this.filterService.applyFilters(cowsByType, [CowState.InHerd.valueOf()], 'cowState');

    if(this.cowSelector.length == 0){
      this.othersalesForm.disable();
      this.othersalesForm.controls['itemsold'].enable();
      this.othersalesForm.controls['cowidsold'].setValue(null);
      this.othersalesForm.controls['price'].setValue(null);
      this.othersalesForm.controls['offtakername'].setValue(null);
      this.othersalesForm.controls['offtakercompany'].setValue(null);
      this.disableSubmitBtn = true;
    }
    else{
      this.othersalesForm.enable();
      this.disableSubmitBtn = false;
    }
  }

  returnToOverview() {
    this.otherSalesService.otherSalesListState.next(true);
    this.cowService.cowListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }
}
