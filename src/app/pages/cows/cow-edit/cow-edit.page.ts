import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    this.cowService.updateCow(cowForm.getRawValue()).subscribe(response => {
      if (response.status == 200) {
        this.cowService.cowUpdated.next(response.body['cow']);
        this.router.navigateByUrl('tabs/herd');
      }
    });
  }

  onDelete(id) {
    this.router.navigate([`delete-cow/${id}`]);
  }
}
