import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { Storage } from '@ionic/storage';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { AccountService } from 'src/app/services/account/account.service';
import { FormGroup } from '@angular/forms';
import * as key from 'src/app/common/objects/Constants';
import { UserDetails } from 'src/app/common/objects/UserDetails';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  constructor(private accountService: AccountService, private storage: Storage, private httpService: HttpService) { }

  public farm: FarmDetails;

  public loadFarm(userId: string) {
    return this.httpService.get(null, `${environment.url}/api/farm/getUserFarm/${userId}`)
      .then(res => {
        this.setFarm(res['farm']);
      });
  }

  public getFarm() {
    return this.storage.get(key.FARM).then((farm: FarmDetails) => {
      if (farm)
        return farm;

      this.accountService.getUser().then((user: UserDetails) => {
        this.loadFarm(user.id).then(() => {
          return this.farm;
        });
      });
    });
  }

  public registerFarm(farmForm: FormGroup) {
    return this.httpService.post3('Registering farm...', `${environment.url}/api/farm/register`, farmForm.value)
      .then((res) => {
        this.setFarm(res['farmDetails']);
      });
  }

  public updateFarm(farmDetails: FarmDetails) {
    return this.httpService.put1('Updating...', `${environment.url}/api/farm/update`, farmDetails).then(() => {
      this.setFarm(farmDetails);
    });
  }

  private setFarm(farmDetails: FarmDetails) {
    this.storage.set(key.FARM, farmDetails).then(() => {
      this.farm = farmDetails;
      this.accountService.farmState.next(true);
    });
  }
}
