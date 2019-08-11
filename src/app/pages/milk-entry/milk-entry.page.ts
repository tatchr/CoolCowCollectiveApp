import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import * as moment from 'moment';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.page.html',
  styleUrls: ['./milk-entry.page.scss'],
})

export class MilkEntryPage implements OnInit {

  datePickerObj: any;
  selectedDateString: String;
  timeOfDay: String;

  constructor(public datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date('2025-12-31');
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);
    this.selectedDateString = this.formatDate(new Date());
  }

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if(typeof data.data !== 'undefined' && data.data.date !== 'Invalid date'){
        this.selectedDateString = this.formatDate(data.data.date);
      }
    });
  }

  formatDate(date){
    return moment(date).format('YYYY-MM-DD');
  }

}
