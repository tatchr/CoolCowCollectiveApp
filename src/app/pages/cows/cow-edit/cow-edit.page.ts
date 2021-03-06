import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-cow-edit',
  templateUrl: './cow-edit.page.html',
  styleUrls: ['./cow-edit.page.scss'],
})
export class CowEditPage implements OnInit {

  cowDetails: CowDetails;

  constructor(private cowService: CowService, private router: Router, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(() => {      
      if (this.router.getCurrentNavigation().extras.state) {
        this.cowDetails = this.router.getCurrentNavigation().extras.state.cowDetails;
      }
    });
  }

  ngOnInit() { }

  onSubmit(cowForm) {
    this.cowService.update(cowForm.getRawValue()).subscribe(() => {
      this.router.navigateByUrl('tabs/herd');
    });
  }

  onDelete(cow: CowDetails) {
    let navigationExtras: NavigationExtras = {
      state: {
        cow: cow
      }
    };

    this.router.navigate(['delete-cow'], navigationExtras);
  }
}
