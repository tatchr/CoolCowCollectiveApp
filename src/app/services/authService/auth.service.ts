import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';

const TOKEN_KEY = 'access_token';
const USER_ID = 'userId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(null);

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage, private plt: Platform, private alertService: AlertService) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
          this.storage.remove(USER_ID);
          this.authenticationState.next(false);
        }
      } else {
        this.authenticationState.next(false);
      }
    });
  }

  registerUser(credentials) {
    return this.http.post(this.url + '/api/user/register', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  confirmEmail(credentials) {
    return this.http.post(this.url + '/api/user/confirmEmail', credentials).pipe(
      tap(res => {
        this.storage.set(USER_ID, res['userId']).then(() => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
        });        
      }),
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resendConfirmationCode(credentials) {
    return this.http.post(this.url + '/api/user/resendConfirmationCode', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  login(credentials) {
    return this.http.post(this.url + '/api/user/login', credentials)
      .pipe(
        tap(res => {
          this.storage.set(USER_ID, res['userId']).then(() => {
            this.storage.set(TOKEN_KEY, res['token']);
            this.user = this.helper.decodeToken(res['token']);
            this.authenticationState.next(true);
          });          
        }),
        catchError(e => {
          console.log(e);
          this.alertService.showAlert(e.error.errMessage);
          throw new Error(e);
        })
      );
  }

  forgotPassword(credentials) {
    return this.http.post(this.url + '/api/user/forgotPassword', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  verifyPasswordResetCode(credentials) {
    return this.http.post(this.url + '/api/user/verifyPasswordResetCode', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resendPasswordResetCode(credentials) {
    return this.http.post(this.url + '/api/user/resendPasswordResetCode', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resetPassword(credentials) {
    return this.http.post(this.url + '/api/user/resetPassword', credentials).pipe(
      catchError(e => {
        this.alertService.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  logout() {
    this.storage.remove(USER_ID);
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getSpecialData() {
    return this.http.get(this.url + '/api/user/getSpecialInfo').pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.alertService.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }  
}
