import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ReportService } from 'src/app/services/report/report.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FarmService } from 'src/app/services/farm/farm.service';
import { UserDetails } from 'src/app/common/objects/UserDetails';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Component({
  selector: 'app-herd-report',
  templateUrl: './herd-report.page.html',
  styleUrls: ['./herd-report.page.scss'],
})
export class HerdReportPage implements OnInit {

  private farmId: string;
  private userId: string;
  //fromDate = new Date('2016-01-01');
  //toDate = new Date();
  //fromDatePickerObj: any;
  //toDatePickerObj: any;
  //selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  //selectedToDateString: string = this.datePicker.formatDate(new Date());

  constructor(private datePicker: DatepickerService, public reportService: ReportService,
    private accountService: AccountService, private farmService: FarmService) { }

  ngOnInit() {
    this.accountService.getUser().then((user: UserDetails) => {
      this.userId = user.id;
    });

    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;
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
