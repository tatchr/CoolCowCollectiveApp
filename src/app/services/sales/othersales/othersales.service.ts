import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Period } from 'src/app/common/objects/Enums';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';


@Injectable({
  providedIn: 'root'
})
export class OthersalesService {

  //farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  otherSaleRegistered = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleUpdated = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleDeleted = new BehaviorSubject<number>(null);

  changeCounter: number = 0;
  otherSalesList: Array<OtherSalesDetails> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private farmService: FarmService) { }

  loadOtherSalesList() {
    return this.farmService.getFarm().then((farm: FarmDetails) => {
      this.getAllOtherSalesRecords(farm.id, this.selectedFromDate, this.selectedToDate).then(res => {
        this.otherSalesList = res['otherSalesDetails'];      
      });
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
    return this.farmService.getFarm().then((farm: FarmDetails) => {
      return this.httpService.get(null, `${environment.url}/farms/${farm.id}/other-sales/${id}`);
    });
  }

  getAllOtherSalesRecords(farmId, fromDate, toDate) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);

    return this.httpService.get('Loading...', `${environment.url}/farms/${farmId}/other-sales?from_date=${from}&to_date=${to}`);
  }

  registerOtherSalesRecord(record) {
    return this.farmService.getFarm().then((farm: FarmDetails) => {
      console.log(record);
      return this.httpService.post3('Saving...', `${environment.url}/farms/${farm.id}/other-sales`, record);
    });
  }

  updateOtherSalesRecord(record) {
    return this.farmService.getFarm().then((farm: FarmDetails) => {
      return this.httpService.put(`${environment.url}/farms/${farm.id}/other-sales`, record);
    });
  }

  deleteOtherSalesRecord(id) {
    return this.farmService.getFarm().then((farm: FarmDetails) => {
      return this.httpService.delete(`${environment.url}/farms/${farm.id}/other-sales/${id}`);
    });
  }
}
