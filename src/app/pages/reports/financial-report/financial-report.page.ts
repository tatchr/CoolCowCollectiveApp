import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ReportService } from 'src/app/services/report/report.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.page.html',
  styleUrls: ['./financial-report.page.scss'],
})
export class FinancialReportPage implements OnInit {

  farmId: string;
  userId: string;
  

  constructor(private datePicker: DatepickerService, public reportService: ReportService, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.storage.get('userId').then(userId => {
      this.userId = userId;
    });
  }

  downloadReport(fileType){
    console.log(fileType);
    this.reportService.getReport(this.userId, this.farmId, 'Financial', fileType, this.reportService.selectedFromDate, this.reportService.selectedToDate);
  }

  async openFromDatePicker(){
    this.reportService.selectedFromDate = await this.datePicker.openDatePicker(this.reportService.selectedFromDate);
  }

  async openToDatePicker(){
    this.reportService.selectedToDate = await this.datePicker.openDatePicker(this.reportService.selectedToDate);
  }

}
