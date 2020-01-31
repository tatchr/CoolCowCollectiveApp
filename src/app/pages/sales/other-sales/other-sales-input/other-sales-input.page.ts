import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage extends OtherSalesBaseComponent implements OnInit {

  cowsList: Array<CowDetails> = [];
  filteredCowsList: Array<CowDetails> = [];
  disableSubmitBtn: boolean = false;
  
  constructor(router: Router, salesService: SalesService, private activatedRoute: ActivatedRoute, cowService: CowService, formBuilder: FormBuilder,
    storage: Storage, datePicker: DatepickerService, private filterService: FilterService) { 
      super(router, salesService, cowService, formBuilder, storage, datePicker);

      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.cowsList = this.router.getCurrentNavigation().extras.state.cowsList;
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
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.salesService.registerOtherSalesRecord(this.othersalesForm.value).then(val => {
        if (val['otherSale']) {
          this.salesService.otherSaleRegistered.next(val['otherSale']);
          this.router.navigateByUrl('/tabs/other-sales-overview');
        }
      });
    }
  }

  itemSelected(event) {
    this.showOtherInput = event.detail.value == 'Other';
    this.showSpermInput = event.detail.value == 'Sperm';
    this.showCowList = this.animalTypes.includes(event.detail.value);
    if (this.showCowList) {
      this.loadCowsList(event.detail.value);
    }
  }

  loadCowsList(cowType) {
    this.filteredCowsList = this.filterService.applyFilters(this.cowsList, [cowType], 'cowType');

    if(this.filteredCowsList.length == 0){
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
    this.salesService.otherSalesListState.next(true);
    this.cowService.cowListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }
}
