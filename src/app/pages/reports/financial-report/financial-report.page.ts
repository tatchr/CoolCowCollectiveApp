import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ReportService } from 'src/app/services/report/report.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FarmService } from 'src/app/services/farm/farm.service';
import { UserDetails } from 'src/app/common/objects/UserDetails';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.page.html',
  styleUrls: ['./financial-report.page.scss'],
})
export class FinancialReportPage implements OnInit {

  farmId: string;
  userId: string;
  

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
