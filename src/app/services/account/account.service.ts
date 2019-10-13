import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  changePassword(form) {
    return this.http.post(environment.url + '/api/user/changepassword', form).pipe(
      catchError(e => {
        console.log(e.error.errMessage);
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }
}
