import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker.service';
import * as moment from 'moment';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.page.html',
  styleUrls: ['./milk-entry.page.scss'],
})

export class MilkEntryPage implements OnInit {

  datePickerObj: any;
  selectedDateString: string;

  constructor(public datePicker: DatepickerService) { }

  ngOnInit() {
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString);
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
