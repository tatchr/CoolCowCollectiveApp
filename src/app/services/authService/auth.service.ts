import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpErrorService } from 'src/app/services/http/httperror.service';
import { USER, TOKEN_KEY, FARM } from 'src/app/common/objects/Constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  decodedToken = null;
  authenticationState = new BehaviorSubject(null);

  constructor(private helper: JwtHelperService, private storage: Storage, private plt: Platform, private httpService: HttpService,
    private httpErrorService: HttpErrorService) {
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
          this.decodedToken = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
          this.storage.remove(USER);
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
    return this.httpService.postWithTap(this.url + '/api/user/confirmEmail', credentials, (res) => this.setUserAndJwtToken(res));
  }

  resendConfirmationCode(credentials) {
    return this.httpService.post(this.url + '/api/user/resendConfirmationCode', credentials);
  }

  login(credentials) {
    this.httpService.post3('Authenticating...', `${environment.url}/api/user/login`, credentials)
      .then(res => this.setUserAndJwtToken(res));
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
    this.storage.remove(USER);
    this.storage.remove(FARM);
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  setUserAndJwtToken(source) {
    this.storage.set(USER, source['userDetails']).then(() => {
      this.storage.set(TOKEN_KEY, source['token']);
      this.decodedToken = this.helper.decodeToken(source['token']);
      this.authenticationState.next(true);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
