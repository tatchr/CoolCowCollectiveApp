import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { MilkSalesBaseComponent } from '../milk-sales-base/milk-sales-base.component';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

@Component({
  selector: 'app-milk-sales-overview',
  templateUrl: './milk-sales-overview.page.html',
  styleUrls: ['./milk-sales-overview.page.scss'],
})
export class MilkSalesOverviewPage extends MilkSalesBaseComponent implements OnInit {

  farmId: string;
  fromDatePickerObj: any;
  toDatePickerObj: any;
  selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDateString: string = this.datePicker.formatDate(new Date());
  milkSalesList: Array<MilkSalesDetails> = [];
  period: string = 'lastweek';

  totalLiters: number;
  totalMoney: number;

  constructor(router: Router, salesService: SalesService, formBuilder: FormBuilder, storage: Storage, datePicker: DatepickerService) {
    super(router, salesService, formBuilder, storage, datePicker);
   }  

  ngOnInit() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadMilkSalesList();
    });
    
    this.salesService.milkSaleRegistered.subscribe(newSale => {
      if (newSale) {
        this.milkSalesList.push(newSale);
        this.computeTotals();
      }
    });

    this.salesService.milkSaleDeleted.subscribe(milkSaleId => {
      if (milkSaleId) {
        let saleToDelete = this.milkSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
        this.milkSalesList.splice(saleToDelete, 1);
        this.computeTotals();
      }
    });

    this.salesService.milkSaleUpdated.subscribe(sale => {
      if (sale) {
        let saleToUpdate = this.milkSalesList.map(x => x.id).findIndex(x => x == sale.id);
        this.milkSalesList[saleToUpdate] = sale;
        this.computeTotals();
      }
    });
  }

  loadMilkSalesList(){
    this.salesService.getAllMilkSalesRecords(this.farmId, this.selectedFromDateString, this.selectedToDateString).then(res => {      
      this.milkSalesList = res['milkSalesDetails'];      
      this.computeTotals();
    });
  }

  computeTotals(){
    this.totalLiters = 0;
    this.totalMoney = 0;

    this.milkSalesList.forEach(item => {
      item.date = this.datePicker.formatDate(item.date);
      this.totalLiters += item.litersSold;
      this.totalMoney += this.round(item.litersSold * item.pricePerLiter, 2);
    });
  }

  openMilkSaleRecord(milkSaleId){
    let index = this.milkSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
    let navigationExtras: NavigationExtras = {
      state: {
        milkSaleDetails: this.milkSalesList[index]
      }
    };
    this.router.navigate(['milk-sales-edit'], navigationExtras);
  }

  moneyReceived(item){
    item.fullAmountPaid = true;
    this.salesService.updateMilkSalesRecord(item).subscribe();
  }

  moneyNotReceived(item){
    item.fullAmountPaid = false;
    this.salesService.updateMilkSalesRecord(item).subscribe();   
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
    this.loadMilkSalesList();  
  }

  async openFromDatePicker(){
    this.period = '';
    this.selectedFromDateString = await this.datePicker.openDatePicker(this.fromDate, this.toDate, this.selectedFromDateString);
    this.loadMilkSalesList();    
  }

  async openToDatePicker(){
    this.period = '';
    this.selectedToDateString = await this.datePicker.openDatePicker(this.fromDate, this.toDate, this.selectedToDateString);
    this.loadMilkSalesList();    
  }  
}
