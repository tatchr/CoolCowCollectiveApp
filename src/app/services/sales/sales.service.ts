import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  milkSalesListState = new BehaviorSubject(null);

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getMilkSaleRecord(id){
    return this.http.get(environment.url + '/api/milksales/get/' + id).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  getAllMilkSalesRecords(farmId, fromDate, toDate){
    return this.http.get(environment.url + '/api/milksales/getAll/' + farmId + "/" + fromDate + "/" + toDate).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  registerMilkSalesRecord(record) {
    return this.http.post(environment.url + '/api/milksales/register', record).pipe(
      catchError(e => {
        console.log(e.error.errMessage);
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  updateMilkSalesRecord(record) {
    return this.http.put(environment.url + '/api/milksales/update', record).pipe(
      catchError(e => {
        console.log(e.error.errMessage);
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
}
