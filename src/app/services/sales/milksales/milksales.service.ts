import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';

@Injectable({
  providedIn: 'root'
})
export class MilksalesService {

  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  milkSaleRegistered = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleUpdated = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleDeleted = new BehaviorSubject<number>(null);

  milkSalesList: Array<MilkSalesDetails> = [];
  totalLiters: number = 0;
  totalMoney: number = 0;
  totalMoneyReceived: number = 0;

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage) {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadMilkSalesList();
    });
  }

  loadMilkSalesList() {
    this.getAllMilkSalesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.milkSalesList = res['milkSalesDetails'];
      this.computeTotals();
    });
  }

  periodSelected(period){
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);
    
    this.selectedToDate = result.toDate;
    this.selectedFromDate = result.fromDate;    
    
    this.loadMilkSalesList();  
  }

  computeTotals(){
    this.totalLiters = 0;
    this.totalMoney = 0;    
    this.totalMoneyReceived = 0;    

    this.milkSalesList.forEach(item => {
      item.date = this.datePicker.formatDate(item.date);
      this.totalLiters += item.litersSold;
      this.totalMoney += this.round(item.litersSold * item.pricePerLiter, 2);
      if(item.fullAmountPaid){
        this.totalMoneyReceived += this.round(item.litersSold * item.pricePerLiter, 2);
      }
    });
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  getMilkSaleRecord(id) {
    return this.httpService.get(environment.url + '/api/milksales/get/' + id);
  }

  getAllMilkSalesRecords(farmId, fromDate, toDate) {
    return this.httpService.get2('Loading...', environment.url + '/api/milksales/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerMilkSalesRecord(record) {
    return this.httpService.post3('Saving...', environment.url + '/api/milksales/register', record);
  }

  updateMilkSalesRecord(record) {
    return this.httpService.put(environment.url + '/api/milksales/update', record);
  }

  deleteMilkSalesRecord(id) {
    return this.httpService.delete(environment.url + '/api/milksales/delete/' + id);
  }

}
