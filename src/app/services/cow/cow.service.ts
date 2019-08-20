import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CowService {  

  cowListState = new BehaviorSubject(null);

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getCow(cowId){
    return this.http.get(environment.url + '/api/cow/get/' + cowId).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  getAllCows(farmId){
    return this.http.get(environment.url + '/api/cow/getAll/' + farmId).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  updateCow(cowdetails){
    return this.http.put(environment.url + '/api/cow/update', cowdetails).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  deleteCow(cowId){
    return this.http.delete(environment.url + '/api/cow/delete/' + cowId).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  registerCow(cowdetails) {
    return this.http.post(environment.url + '/api/cow/register', cowdetails).pipe(
      catchError(e => {
        console.log(e.error.errMessage);
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
}
