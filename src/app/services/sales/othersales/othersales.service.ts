import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class OthersalesService {

  farmId: string;
  otherSalesListState = new BehaviorSubject(null);

  otherSaleRegistered = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleUpdated = new BehaviorSubject<OtherSalesDetails>(null);
  otherSaleDeleted = new BehaviorSubject<number>(null);

  constructor(private httpService: HttpService, private storage: Storage) {
    console.log('Sales service created!');

    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });
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
