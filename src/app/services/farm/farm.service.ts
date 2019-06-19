import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {map, catchError } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

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
}
