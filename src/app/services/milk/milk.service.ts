import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MilkService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getAllMilkRecords(farmId, date, timeOfDay){
    return this.http.get(environment.url + '/api/milkproduction/getAll/' + farmId + "/" + date + "/" + timeOfDay).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  registerMilkRecords(records) {
    return this.http.post(environment.url + '/api/milkproduction/register', records).pipe(
      catchError(e => {
        console.log(e.error.errMessage);
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
}
