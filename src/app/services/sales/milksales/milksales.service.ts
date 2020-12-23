import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { MathService } from '../../math/math.service';

@Injectable({
  providedIn: 'root'
})
export class MilksalesService {

  changeCounter: number = 0;
  farmId: string;
  selectedFromDate: Date = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: Date = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  milkSaleRegistered = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleUpdated = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleDeleted = new BehaviorSubject<number>(null);

  milkSalesList: Array<MilkSalesDetails> = [];
  totalLiters: number = 0;
  totalMoney: number = 0;
  totalMoneyReceived: number = 0;

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage, 
    private farmService: FarmService, private math: MathService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;
      this.loadMilkSalesList();
    });
  }

  loadMilkSalesList() {
    this.getAllMilkSalesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.milkSalesList = res['milkSalesDetails'];
      this.computeTotals();
    });
  }

  computeTotals(){
    this.totalLiters = 0;
    this.totalMoney = 0;    
    this.totalMoneyReceived = 0;    

    this.milkSalesList.forEach(item => {
      item.date = item.date;
      this.totalLiters += item.litersSold;
      this.totalMoney += this.math.round(item.litersSold * item.pricePerLiter, 2);
      if(item.fullAmountPaid){
        this.totalMoneyReceived += this.math.round(item.litersSold * item.pricePerLiter, 2);
      }
    });
  }

  getMilkSaleRecord(id) {
    return this.httpService.get(null, `${environment.url}/farms/${this.farmId}/milk-sales/${id}`);
  }

  getAllMilkSalesRecords(farmId, fromDate, toDate) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', 
      `${environment.url}/farms/${farmId}/milk-sales?from_date=${from}&to_date=${to}`);
  }

  registerMilkSalesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/farms/${this.farmId}/milk-sales`, record);
  }

  updateMilkSalesRecord(record) {
    return this.httpService.put(`${environment.url}/farms/${this.farmId}/milk-sales`, record);
  }

  deleteMilkSalesRecord(id) {
    return this.httpService.delete(`${environment.url}/farms/${this.farmId}/milk-sales/${id}`);
  }

}
