import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage, private plt: Platform, private alertController: AlertController) {
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
        }
      }
    });
  }

  registerUser(credentials) {
    return this.http.post(this.url + '/api/users/register', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  confirmEmail(credentials) {
    return this.http.post(this.url + '/api/users/confirmEmail', credentials).pipe(
      tap(res => {
        this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
      }),
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resendConfirmationCode(credentials) {
    return this.http.post(this.url + '/api/users/resendConfirmationCode', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  login(credentials) {
    return this.http.post(this.url + '/api/users/login', credentials)
      .pipe(
        tap(res => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
        }),
        catchError(e => {
          console.log(e);
          this.showAlert(e.error.errMessage);
          throw new Error(e);
        })
      );
  }

  forgotPassword(credentials) {
    return this.http.post(this.url + '/api/users/forgotPassword', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  verifyPasswordResetCode(credentials) {
    return this.http.post(this.url + '/api/users/verifyPasswordResetCode', credentials).pipe(      
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resendPasswordResetCode(credentials) {
    return this.http.post(this.url + '/api/users/resendPasswordResetCode', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  resetPassword(credentials) {
    return this.http.post(this.url + '/api/users/resetPassword', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getSpecialData() {
    return this.http.get(this.url + '/api/users/getSpecialInfo').pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
