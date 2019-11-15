import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpService: HttpService) { }

  changePassword(form) {
    return this.httpService.post(environment.url + '/api/user/changepassword', form);
  }

  getUserDetails(userId){
    return this.httpService.get(environment.url + '/api/user/getUser/' + userId);
  }

  updateUserDetails(userdetails){
    return this.httpService.put(environment.url + '/api/user/update', userdetails);
  }
}