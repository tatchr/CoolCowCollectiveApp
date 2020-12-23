import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FarmService } from 'src/app/services/farm/farm.service';
import { UserDetails } from 'src/app/common/objects/UserDetails';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.page.html',
  styleUrls: ['./report-overview.page.scss'],
})
export class ReportOverviewPage implements OnInit {

  constructor(public service: ReportService, private accountService: AccountService, private farmService: FarmService) { }

  ngOnInit() {
  }

  downloadReport(fileType){
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.accountService.getUser().then((user: UserDetails) => {
        let reports = this.service.reportContent.filter(x => x.isChecked).map(x => x.val);
        this.service.getReport(user.id, farm.id, reports, fileType, this.service.selectedFromDate, this.service.selectedToDate);
      })
    });
  }

}
