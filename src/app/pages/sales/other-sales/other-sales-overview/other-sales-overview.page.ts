import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { Router, NavigationExtras } from '@angular/router';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-other-sales-overview',
  templateUrl: './other-sales-overview.page.html',
  styleUrls: ['./other-sales-overview.page.scss'],
})
export class OtherSalesOverviewPage implements OnInit {

  farmId: string;
  fromDatePickerObj: any;
  toDatePickerObj: any;
  selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDateString: string = this.datePicker.formatDate(new Date());
  otherSalesList: Array<OtherSalesDetails> = [];
  cowsList: Array<CowDetails> = [];
  period: string = 'lastweek';

  constructor(private router: Router, private salesService: SalesService, private cowService: CowService, private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.fromDatePickerObj = this.datePicker.getDatepickerObj(this.selectedFromDateString, fromDate, toDate);
    this.toDatePickerObj = this.datePicker.getDatepickerObj(this.selectedToDateString, fromDate, toDate);    

    this.salesService.otherSaleRegistered.subscribe(newSale => {
      if (newSale) {
        this.otherSalesList.push(newSale);
      }
    });

    this.salesService.otherSaleDeleted.subscribe(milkSaleId => {
      if (milkSaleId) {
        let saleToDelete = this.otherSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
        this.otherSalesList.splice(saleToDelete, 1);
      }
    });

    this.salesService.otherSaleUpdated.subscribe(sale => {
      if (sale) {
        let saleToUpdate = this.otherSalesList.map(x => x.id).findIndex(x => x == sale.id);
        this.otherSalesList[saleToUpdate] = sale;
      }
    });

    this.initiate();
  }  

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadOtherSalesList();
      //this.loadCowsList();
    });    
  }

  loadOtherSalesList(){
    this.salesService.getAllOtherSalesRecords(this.farmId, this.selectedFromDateString, this.selectedToDateString)
    .then(res => {
      this.otherSalesList = res['otherSalesDetails'];
      this.otherSalesList.forEach(item => {
        item.date = this.datePicker.formatDate(item.date);        
      });
    })
    .then(() => this.cowService.getAllCows(this.farmId)
      .then(res => {
        this.cowsList = res['cows'];
      }));
  }

  loadCowsList() {
    this.cowService.getAllCows(this.farmId).then(res => {
      this.cowsList = res['cows'];
    });
  }

  openNewOtherSaleRecord(){    
    let navigationExtras: NavigationExtras = {
      state: {
        cowsList: this.cowsList
      }
    };
    this.router.navigate(['other-sales-input'], navigationExtras);
  }

  openOtherSaleRecord(otherSaleId){
    console.log(this.otherSalesList);
    let index = this.otherSalesList.map(x => x.id).findIndex(x => x == otherSaleId);
    console.log(index);
    let navigationExtras: NavigationExtras = {
      state: {
        otherSaleDetails: this.otherSalesList[index],
        cowsList: this.cowsList
      }
    };
    this.router.navigate(['other-sales-edit'], navigationExtras);
  }

  moneyReceived(item){
    item.fullAmountPaid = true;
    this.salesService.updateOtherSalesRecord(item).subscribe();
  }

  moneyNotReceived(item){
    item.fullAmountPaid = false;
    this.salesService.updateOtherSalesRecord(item).subscribe();   
  }

  periodSelected(period){
    this.period = period;
    this.selectedToDateString = this.datePicker.formatDate(new Date());
    if(this.period == 'lastweek'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 7, 'days');
    }
    if(this.period == 'last2weeks'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 14, 'days');
    }
    if(this.period == 'lastmonth'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 1, 'months');
    }
    if(this.period == 'lastquarter'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 3, 'months');
    }
    if(this.period == 'lastyear'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 1, 'years');
    }
    this.loadOtherSalesList();  
  }

  async openFromDatePicker() {
    this.fromDatePickerObj.inputDate = this.selectedFromDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.fromDatePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.period = '';
        this.selectedFromDateString = this.datePicker.formatDate(data.data.date);
        this.loadOtherSalesList();
      }
    });
  }

  async openToDatePicker() {
    this.toDatePickerObj.inputDate = this.selectedToDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.toDatePickerObj);
    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.period = '';
        this.selectedToDateString = this.datePicker.formatDate(data.data.date);
        this.loadOtherSalesList();
      }
    });
  }

}
