import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { Storage } from '@ionic/storage';

const FARM_ID = 'farmId';

@Injectable({
  providedIn: 'root'
})
export class FarmService { 

  farmsList: Array<Object> = [];

  constructor(private storage: Storage, private httpService: HttpService) { }

  loadAllFarms(userId) {
    return this.getAllFarms(userId).then(res => {
      this.farmsList = res['farms'];
      if (this.farmsList.length > 0) {
        this.storage.set(FARM_ID, res['farms'][0]['farmId']);
      }
    });
  }

  getFarm(farmId){
    return this.httpService.get(null, environment.url + '/api/farm/get/' + farmId);
  }

  getAllFarms(userId){
    return this.httpService.get(null, environment.url + '/api/farm/getAll/' + userId);
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
