import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { Storage } from '@ionic/storage';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

const FARM_ID = 'farmId';
const FARM = 'farm';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  farm: FarmDetails = null;

  constructor(private accountService: AccountService, private storage: Storage, private httpService: HttpService, private router: Router) { }

  loadAllFarms(userId) {
    return this.getUserFarm(userId).then(res => {
      this.farm = res['farm'];
      if (res['farm'] != null) {
        this.storage.set(FARM_ID, res['farm']['farmId']);
        this.storage.set(FARM, res['farm']).then(() => {
          this.storage.get(FARM).then(val => console.log(val.farmId))
        });
      }
    });
  }

  getFarm(farmId) {
    return this.httpService.get(null, `${environment.url}/api/farm/get/${farmId}`);
  }

  getUserFarm(userId) {
    return this.httpService.get(null, `${environment.url}/api/farm/getUserFarm/` + userId);
  }

  registerFarm(credentials) {
    return this.httpService.post3('Registering farm...', `${environment.url}/api/farm/register`, credentials)
      .then((res) => {
        this.storage.set(FARM, res['farmDetails'])
          .then(() => {
            this.farm = res['farmDetails'];
            this.accountService.farmState.next(true);
          });
      })
  }

  updateFarm(farmDetails) {
    return this.httpService.put(`${environment.url}/api/farm/update`, farmDetails);
  }
}
