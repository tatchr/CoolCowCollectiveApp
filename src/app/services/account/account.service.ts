import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/authService/auth.service';
import { UserDetails } from 'src/app/common/objects/UserDetails';
import * as key from 'src/app/common/objects/Constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public user: UserDetails;
  public farmState = new BehaviorSubject<boolean>(null);
  public userUpdated = new BehaviorSubject<UserDetails>(null);

  constructor(private httpService: HttpService, private storage: Storage, private authService: AuthService) {
    this.farmState.subscribe(farmExists => {
      if(farmExists != null){
        this.storage.get(key.USER).then((user: UserDetails) => {
          user.hasFarm = farmExists;
          this.storage.set(key.USER, user);
        }); 
      }           
    });
  }

  public getUser(){
    return this.storage.get(key.USER).then((user: UserDetails) => {
      if(user)
        return user;
      
      this.authService.logout();
    });    
  }

  public setUser(user: UserDetails){
    this.storage.set(key.USER, user);
  }

  changePassword(form) {
    return this.httpService.post(`${environment.url}/api/user/changepassword`, form);
  }

  getUserDetails(userId) {
    return this.httpService.get(null, `${environment.url}/api/user/getUser/${userId}`);
  }

  updateUserDetails(userdetails) {
    return this.httpService.put(`${environment.url}/api/user/update`, userdetails);
  }
}
