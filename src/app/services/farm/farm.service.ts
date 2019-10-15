import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getFarm(farmId){
    return this.http.get(environment.url + '/api/farm/get/' + farmId).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  getAllFarms(userId){
    return this.http.get(environment.url + '/api/farm/getAll/' + userId).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
  
  registerFarm(credentials) {
    return this.http.post(environment.url + '/api/farm/register', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  updateFarm(farmDetails){
    return this.http.put(environment.url + '/api/farm/update', farmDetails).pipe(
      map(res => {
        return res;
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
}
