import { Component, OnInit } from '@angular/core';
import { CowService } from 'src/app/services/cow/cow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CowDetails } from 'src/app/common/objects/CowDetails';

@Component({
  selector: 'app-delete-cow',
  templateUrl: './delete-cow.page.html',
  styleUrls: ['./delete-cow.page.scss'],
})
export class DeleteCowPage implements OnInit {

  cow: CowDetails;
  keepRecords: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cowService: CowService) { 
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.cow = this.router.getCurrentNavigation().extras.state.cow;
      }
    });
  }

  ngOnInit() { }

  deleteCow() {
    this.cowService.delete(this.cow, this.keepRecords).subscribe(res => {
      this.router.navigateByUrl('/tabs/herd');
    });
  }
}
