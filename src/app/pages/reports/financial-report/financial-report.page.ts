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
  fromDatePickerObj: any;
  toDatePickerObj: any;
  selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDateString: string = this.datePicker.formatDate(new Date());

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
    console.log(fileType);
    this.reportService.getReport(this.userId, this.farmId, 'Financial', fileType, this.selectedFromDateString, this.selectedToDateString);
  }

  async openFromDatePicker(){
    this.selectedFromDateString = await this.datePicker.openDatePicker(this.selectedFromDateString);
  }

  async openToDatePicker(){
    this.selectedToDateString = await this.datePicker.openDatePicker(this.selectedToDateString);
  }

}
