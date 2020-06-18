import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public farmState = new BehaviorSubject<boolean>(null);
  public userHasFarm: boolean;

  constructor(private httpService: HttpService) { 
    this.farmState.subscribe(farmExists => {
      this.userHasFarm = farmExists;
    });
  }

  changePassword(form) {
    return this.httpService.post(environment.url + '/api/user/changepassword', form);
  }

  getUserDetails(userId){
    return this.httpService.get(null, environment.url + '/api/user/getUser/' + userId);
  }

  updateUserDetails(userdetails){
    return this.httpService.put(environment.url + '/api/user/update', userdetails);
  }
}
