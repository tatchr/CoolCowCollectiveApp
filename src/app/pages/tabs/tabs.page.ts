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

  ngOnInit() { }

  goToDashboard(){
    this.accountService.getUser().then((user: UserDetails) => {
      if(user.hasFarm){
        this.router.navigate(['tabs/farm-dashboard']);
      }
      else{
        this.router.navigate(['new-farm']);
      }
    });    
  }
}
