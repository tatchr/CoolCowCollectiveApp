import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-other-sales-edit',
  templateUrl: './other-sales-edit.page.html',
  styleUrls: ['./other-sales-edit.page.scss'],
})
export class OtherSalesEditPage implements OnInit {

  otherSaleId: string;
  othersalesForm: FormGroup;
  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());
  cowsList: Array<CowDetails> = [];
  showCowList: boolean;
  showOtherInput: boolean;
  showSpermInput: boolean;
  animalTypes: Array<string> = ['Calf', 'Cow', 'Bull', 'Heifer'];
  otherItemDescription: string = "";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private salesService: SalesService, private cowService: CowService, private datePicker: DatepickerService, private storage: Storage, private alertService: AlertService) { }

  ngOnInit() {
    this.initiate();
  }
  
  initiate() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.otherSaleId = this.activatedRoute.snapshot.paramMap.get('otherSaleId');
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.getMilkSale();   
  }  

  getMilkSale(){
    this.salesService.getOtherSaleRecord(this.otherSaleId).subscribe(res => {
      console.log(res['otherSale']);
      this.populateForm(res['otherSale']);      
    });
  }

  populateForm(otherSalesDetails){
    this.selectedDateString = this.datePicker.formatDate(otherSalesDetails.date);

    this.othersalesForm = this.formBuilder.group({
      id: this.otherSaleId,
      farmId: this.farmId,
      date: this.selectedDateString,
      itemsold: [{value: this.getItemSold(otherSalesDetails.itemSold), disabled: true}],
      cowidsold: [{value: otherSalesDetails.cowIdSold, disabled: true}],
      price: [otherSalesDetails.price, [Validators.required, Validators.min(0.0)]],
      quantity: [otherSalesDetails.quantity, [Validators.min(0.0), Validators.max(100000.00)]],
      offtakername: [otherSalesDetails.offtakerName],
      offtakercompany: [otherSalesDetails.offtakerCompany],
    });
  }

  getItemSold(itemSold){
    console.log(itemSold);
    this.showSpermInput = itemSold == 'Sperm';
    this.showCowList = this.animalTypes.includes(itemSold); 

    if(this.showCowList){
      this.loadCowsList(itemSold);
      return itemSold
    }

    if(!this.animalTypes.includes(itemSold) && !this.showSpermInput){
      this.showOtherInput = true;
      this.otherItemDescription = itemSold;
      return 'Other';
    }    

    return itemSold;
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
    this.cowService.getAllCowsOfType(this.farmId, cowType).subscribe(res => {
      this.cowsList = res['cows'];
      //this.cowService.cowListState.next(false);
    });
  }
  
  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  onSubmit() {
    if(this.othersalesForm.valid){
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);
      
      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.salesService.updateOtherSalesRecord(this.othersalesForm.value).subscribe(val => {
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

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);    

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.selectedDateString = this.datePicker.formatDate(data.data.date);
      }
    });
  }

}
