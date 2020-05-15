import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.page.html',
  styleUrls: ['./report-overview.page.scss'],
})
export class ReportOverviewPage implements OnInit {

  constructor(public service: ReportService, private storage: Storage) { }

  ngOnInit() {
  }

  downloadReport(fileType){
    this.storage.get('farmId').then(farmId => {
      this.storage.get('userId').then(userId => {
        let reports = this.service.reportContent.filter(x => x.isChecked).map(x => x.val);
        this.service.getReport(userId, farmId, reports, fileType, this.service.selectedFromDate, this.service.selectedToDate);
      });
    });

    

    
  }

}
