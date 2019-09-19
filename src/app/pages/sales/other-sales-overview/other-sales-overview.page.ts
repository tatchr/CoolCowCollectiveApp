import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-other-sales-overview',
  templateUrl: './other-sales-overview.page.html',
  styleUrls: ['./other-sales-overview.page.scss'],
})
export class OtherSalesOverviewPage implements OnInit {

  farmId: string;
  fromDatePickerObj: any;
  toDatePickerObj: any;
  selectedFromDateString: string = this.datePicker.formatDate(new Date());
  selectedToDateString: string = this.datePicker.formatDate(new Date());
  milkSalesList: Array<MilkSalesDetails> = [];
  period: string = '';

  constructor(private salesService: SalesService, private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.fromDatePickerObj = this.datePicker.getDatepickerObj(this.selectedFromDateString, fromDate, toDate);
    this.toDatePickerObj = this.datePicker.getDatepickerObj(this.selectedToDateString, fromDate, toDate);

    this.initiate();
  }

  ionViewDidEnter() {
    this.salesService.milkSalesListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.loadOtherSalesList();
      }
    });
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadOtherSalesList();
    });    
  }

  loadOtherSalesList(){
    // this.salesService.getAllOtherSalesRecords(this.farmId, this.selectedFromDateString, this.selectedToDateString).subscribe(res => {
    //   this.milkSalesList = res['milkSalesDetails'];
    //   this.milkSalesList.forEach(item => {
    //     item.date = this.datePicker.formatDateYYYYMMMDD(item.date);        
    //   });
    // });
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
