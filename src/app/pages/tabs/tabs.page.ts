import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserDetails } from 'src/app/common/objects/UserDetails';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private accountService: AccountService, private storage: Storage, private router: Router) { }

  ngOnInit() { 
    this.storage.get('userDetails').then((user: UserDetails) => {
      this.accountService.farmState.next(user.hasFarm);
    });
  }

  goToDashboard(){
    if(this.accountService.userHasFarm){
      this.router.navigate(['tabs/farm-dashboard']);
    }
    else{
      this.router.navigate(['tabs/new-farm']);
    }
  }
}
