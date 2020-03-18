import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { Storage } from '@ionic/storage';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Period } from 'src/app/common/objects/Enums';


@Injectable({
  providedIn: 'root'
})
export class OthersalesService {

  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  otherSaleRegistered = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleUpdated = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleDeleted = new BehaviorSubject<number>(null);

  changeCounter: number = 0;
  otherSalesList: Array<OtherSalesDetails> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage) {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadOtherSalesList();
    });
  }

  loadOtherSalesList() {
    this.getAllOtherSalesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.otherSalesList = res['otherSalesDetails'];      
    });
  }

  periodSelected(period) {
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);

    this.selectedToDate = result.toDate;
    this.selectedFromDate = result.fromDate;

    this.loadOtherSalesList();
  }

  getOtherSaleRecord(id) {
    return this.httpService.get(environment.url + '/api/othersales/get/' + id);
  }

  getAllOtherSalesRecords(farmId, fromDate, toDate) {
    return this.httpService.get2('Loading...', environment.url + '/api/othersales/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerOtherSalesRecord(record) {
    return this.httpService.post3('Saving...', environment.url + '/api/othersales/register', record);
  }

  updateOtherSalesRecord(record) {
    return this.httpService.put(environment.url + '/api/othersales/update', record);
  }

  deleteOtherSalesRecord(id) {
    return this.httpService.delete(environment.url + '/api/othersales/delete/' + id);
  }
}
