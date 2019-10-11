import { Component, OnInit } from '@angular/core';
import { CowService } from 'src/app/services/cow/cow.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-cow',
  templateUrl: './delete-cow.page.html',
  styleUrls: ['./delete-cow.page.scss'],
})
export class DeleteCowPage implements OnInit {

  cowId: string;
  keepRecords: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cowService: CowService) { }

  ngOnInit() {
    this.initiate();
  }

  initiate(){
    this.cowId = this.activatedRoute.snapshot.paramMap.get('cowId');    
  }

  deleteCow() {
    this.cowService.deleteCow(this.cowId).subscribe(val => {
      if(val){
        this.cowService.cowListState.next(true);
        this.router.navigateByUrl('/tabs/herd');
      }
    });
  }
}
