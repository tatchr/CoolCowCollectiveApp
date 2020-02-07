import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpErrorService } from 'src/app/services/http/httperror.service';
import { OverlayService } from 'src/app/services/overlay/overlay.service';

const TOKEN_KEY = 'access_token';
const USER_ID = 'userId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(null);

  constructor(private helper: JwtHelperService, private storage: Storage, private plt: Platform, private httpService: HttpService, 
    private httpErrorService: HttpErrorService, private overlayService: OverlayService) {
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
    return this.httpService.post(this.url + '/api/user/register', credentials);
  }

  confirmEmail(credentials) {
    return this.httpService.postWithTap(this.url + '/api/user/confirmEmail', credentials, (res) => this.setUserIdAndJwtToken(res));
  }  

  resendConfirmationCode(credentials) {
    return this.httpService.post(this.url + '/api/user/resendConfirmationCode', credentials);
  }

  login(credentials) {
    let id = Math.random().toString(36).substring(7);

    this.overlayService.presentLoader(id, 'Authenticating...');

    return this.httpService.post2(this.url + '/api/user/login', credentials, 
      res => this.setUserIdAndJwtToken(res), 
      () => this.overlayService.dismissLoader(id));  
  }

  forgotPassword(credentials) {
    return this.httpService.post(this.url + '/api/user/forgotPassword', credentials);
  }

  verifyPasswordResetCode(credentials) {
    return this.httpService.post(this.url + '/api/user/verifyPasswordResetCode', credentials);
  }

  resendPasswordResetCode(credentials) {
    return this.httpService.post(this.url + '/api/user/resendPasswordResetCode', credentials);
  }

  resetPassword(credentials) {
    return this.httpService.post(this.url + '/api/user/resetPassword', credentials);
  }

  logout() {
    this.storage.remove(USER_ID);
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  setUserIdAndJwtToken(source){
    this.storage.set(USER_ID, source['userId']).then(() => {
      this.storage.set(TOKEN_KEY, source['token']);
      this.user = this.helper.decodeToken(source['token']);
      this.authenticationState.next(true);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
