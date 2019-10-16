import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private httpService: HttpService) { }

  getFarm(farmId){
    return this.httpService.get(environment.url + '/api/farm/get/' + farmId);
  }

  getAllFarms(userId){
    return this.httpService.get(environment.url + '/api/farm/getAll/' + userId);
  }
  
  registerFarm(credentials) {
    return this.httpService.post(environment.url + '/api/farm/register', credentials);
  }

  updateFarm(farmDetails){
    return this.httpService.put(environment.url + '/api/farm/update', farmDetails);
  }  
}
