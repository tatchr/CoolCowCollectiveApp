import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ReportService } from 'src/app/services/report/report.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-herd-report',
  templateUrl: './herd-report.page.html',
  styleUrls: ['./herd-report.page.scss'],
})
export class HerdReportPage implements OnInit {

  farmId: string;
  userId: string;
  //fromDate = new Date('2016-01-01');
  //toDate = new Date();
  //fromDatePickerObj: any;
  //toDatePickerObj: any;
  //selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  //selectedToDateString: string = this.datePicker.formatDate(new Date());

  constructor(private datePicker: DatepickerService, private reportService: ReportService, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.storage.get('userId').then(userId => {
      this.userId = userId;
    });
  }

  downloadReport(fileType){
    this.reportService.getReport(this.userId, this.farmId, 'Herd', fileType, this.reportService.selectedFromDate, this.reportService.selectedToDate);
  }

  async openFromDatePicker(){
    this.reportService.selectedFromDate = await this.datePicker.openDatePicker(this.reportService.selectedFromDate);
  }

  async openToDatePicker(){
    this.reportService.selectedToDate = await this.datePicker.openDatePicker(this.reportService.selectedToDate);
  }

}
