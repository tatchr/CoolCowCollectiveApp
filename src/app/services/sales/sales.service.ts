import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  otherSalesListState = new BehaviorSubject(null);

  milkSaleRegistered = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleUpdated = new BehaviorSubject<MilkSalesDetails>(null);
  milkSaleDeleted = new BehaviorSubject<number>(null);

  otherSaleRegistered = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleUpdated = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleDeleted = new BehaviorSubject<number>(null);

  constructor(private httpService: HttpService) { }

  getMilkSaleRecord(id){
    return this.httpService.get(environment.url + '/api/milksales/get/' + id);
  }

  getAllMilkSalesRecords(farmId, fromDate, toDate){
    return this.httpService.get2('Loading...', environment.url + '/api/milksales/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerMilkSalesRecord(record) {
    return this.httpService.post3('Saving...', environment.url + '/api/milksales/register', record);
  }

  updateMilkSalesRecord(record) {
    return this.httpService.put(environment.url + '/api/milksales/update', record);
  }

  deleteMilkSalesRecord(id) {
    return this.httpService.delete(environment.url + '/api/milksales/delete/' +  id);
  }

  getOtherSaleRecord(id){
    return this.httpService.get(environment.url + '/api/othersales/get/' + id);
  }

  getAllOtherSalesRecords(farmId, fromDate, toDate){
    return this.httpService.get2('Loading...', environment.url + '/api/othersales/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerOtherSalesRecord(record) {
    return this.httpService.post3('Saving...', environment.url + '/api/othersales/register', record);
  }

  updateOtherSalesRecord(record) {
    return this.httpService.put(environment.url + '/api/othersales/update', record);
  }

  deleteOtherSalesRecord(id) {
    return this.httpService.delete(environment.url + '/api/othersales/delete/' +  id);
  }
}
