import { Component, OnInit } from '@angular/core';
import { CowService } from 'src/app/services/cow/cow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MilkService } from 'src/app/services/milk/milk.service';

@Component({
  selector: 'app-delete-cow',
  templateUrl: './delete-cow.page.html',
  styleUrls: ['./delete-cow.page.scss'],
})
export class DeleteCowPage implements OnInit {

  cowId: string;
  keepRecords: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, 
    private cowService: CowService, private milkService: MilkService) { }

  ngOnInit() {
    this.initiate();
  }

  initiate(){
    this.cowId = this.activatedRoute.snapshot.paramMap.get('cowId');    
  }

  deleteCow() {
    this.cowService.deleteCow(this.cowId, this.keepRecords).subscribe(val => {
      if(val){
        this.cowService.cowDeleted.next(this.cowId);
        this.router.navigateByUrl('/tabs/herd');
      }
    });
  }

  private deleteMilkRecords(){
    this.milkService.delete(this.cowId).subscribe(val => {
      if(val){
        this.milkService.milkRecordsUpdated.next(true);
      }
    });
  }
}
