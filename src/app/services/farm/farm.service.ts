import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { Storage } from '@ionic/storage';

const FARM_ID = 'farmId';

@Injectable({
  providedIn: 'root'
})
export class FarmService { 

  constructor(private storage: Storage, private httpService: HttpService) { }

  getFarm(farmId){
    return this.httpService.get(environment.url + '/api/farm/get/' + farmId);
  }

  getAllFarms(userId){
    return this.httpService.get(environment.url + '/api/farm/getAll/' + userId);
  }
  
  registerFarm(credentials) {
    return this.httpService.postWithTap(environment.url + '/api/farm/register', credentials, (res) => this.setFarmId(res));
  }

  updateFarm(farmDetails){
    return this.httpService.put(environment.url + '/api/farm/update', farmDetails);
  }
  
  setFarmId(source){
    this.storage.set(FARM_ID, source['farmId']).then(() => {
      this.storage.get('farmId').then(farmId => { });     
    });
  }
}
