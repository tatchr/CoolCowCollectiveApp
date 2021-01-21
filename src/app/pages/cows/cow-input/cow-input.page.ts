import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-cow-input',
  templateUrl: './cow-input.page.html',
  styleUrls: ['./cow-input.page.scss'],
})
export class CowInputPage implements OnInit {

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
    this.cowService.registerCow(cowForm.value).then(val => {
      if(val){
        this.cowService.cowRegistered.next(val['cow']);
        this.router.navigate(['/tabs/herd'], { replaceUrl: true });
      }
    });
  }
}
