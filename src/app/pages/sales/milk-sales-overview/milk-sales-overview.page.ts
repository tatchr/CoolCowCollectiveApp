import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-milk-sales-overview',
  templateUrl: './milk-sales-overview.page.html',
  styleUrls: ['./milk-sales-overview.page.scss'],
})
export class MilkSalesOverviewPage implements OnInit {

  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());
  milkSalesList: Array<MilkSalesDetails> = [];

  period: string = 'lastweek';
  fromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  toDate: string = this.datePicker.formatDate(new Date());

  constructor(private salesService: SalesService, private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    // let fromDate = new Date('2016-01-01');
    // let toDate = new Date('2025-12-31');
    // this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.initiate();
  }

  ionViewDidEnter() {
    this.salesService.milkSalesListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.loadMilkSalesList();
      }
    });
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadMilkSalesList();
    });    
  }

  loadMilkSalesList(){
    this.salesService.getAllMilkSalesRecords(this.farmId, this.fromDate, this.toDate).subscribe(res => {
      this.milkSalesList = res['milkSalesDetails'];

      this.milkSalesList.forEach(item => {
        item.date = this.datePicker.formatDateYYYYMMMDD(item.date);        
      });
    });
  }

  periodSelected(){
    if(this.period == 'lastweek'){
      this.fromDate = this.datePicker.subtract(new Date(), 7, 'days');
    }
    if(this.period == 'lastmonth'){
      this.fromDate = this.datePicker.subtract(new Date(), 1, 'months');
    }
    if(this.period == 'lastquarter'){
      this.fromDate = this.datePicker.subtract(new Date(), 3, 'months');
    }
    if(this.period == 'lastyear'){
      this.fromDate = this.datePicker.subtract(new Date(), 1, 'years');
    }
    this.loadMilkSalesList();  
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
