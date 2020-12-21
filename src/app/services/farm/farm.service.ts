import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { Storage } from '@ionic/storage';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { AccountService } from 'src/app/services/account/account.service';
import { FormGroup } from '@angular/forms';
import * as key from 'src/app/common/objects/Constants';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private accountService: AccountService, private storage: Storage, private httpService: HttpService) { }

  public farm: FarmDetails;

  loadFarm(userId: string){
    return this.httpService.get(null, `${environment.url}/users/${userId}/farms`).then(response => {
      return this.storage.set(key.FARM, response['farm']).then(farm => {
        return farm;
      });
    });
  }

  getFarm(){
    return this.accountService.getUser().then(user => {
      return this.storage.get(key.FARM).then(storedFarm => {
        if(storedFarm == null){
          return this.loadFarm(user.id).then(farm => {
            return farm;
          });
        }
        else{
          return storedFarm;
        }
      });
    });
  }

  public registerFarm(farmForm: FormGroup) {
    return this.httpService.post3('Registering farm...', `${environment.url}/farms`, farmForm.value)
      .then((res) => {
        this.setFarm(res['farm']);
      });
  }

  public updateFarm(farmDetails: FarmDetails) {
    return this.httpService.put1('Updating...', `${environment.url}/farms`, farmDetails).then(response => {
      this.setFarm(response['farm']);
    });
  }

  private setFarm(farmDetails: FarmDetails) {
    this.storage.set(key.FARM, farmDetails).then(() => {
      this.farm = farmDetails;
    });
  }
}
