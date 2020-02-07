import { Injectable } from '@angular/core';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Period } from 'src/app/common/objects/Enums';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {

  fromDate = new Date('2016-01-01');
  toDate = new Date();

  constructor(public modalCtrl: ModalController) { }

  getDatepickerObj(userInputDate){
    return {
      inputDate: userInputDate,
      fromDate: this.fromDate,
      toDate: this.toDate,
      showTodayButton: true,
      closeOnSelect: false,
      disableWeekDays: [],
      mondayFirst: true,
      setLabel: 'Select',
      todayLabel: 'Today',
      closeLabel: 'Close',
      disabledDates: [],
      titleLabel: 'Select a Date',
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      dateFormat: 'YYYY-MM-DD',
      clearButton: true,
      momentLocale: 'en-US',
      yearInAscending: true,
      btnCloseSetInReverse: true,
      btnProperties: {
        expand: 'block',
        fill: '',
        size: '',
        disabled: '',
        strong: '',
        color: ''
      }
    }
  }

  async getDatePickerModal(datePickerObj) {
    return await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 'objConfig': datePickerObj }
    });    
  }

  async openDatePicker(inputDate : string) : Promise<string> {
    let datePickerObj = this.getDatepickerObj(inputDate);
    let datePickerModal = await this.getDatePickerModal(datePickerObj);
    await datePickerModal.present();

    return await datePickerModal.onDidDismiss().then((data) => {      
      if (typeof data.data === 'undefined' || data.data.date === 'Invalid date') {
        return inputDate;
      }
      
      return this.formatDate(data.data.date);
    });
  }

  formatDate(date) {
    return date != null ? moment(date).format('YYYY-MM-DD') : null;
  }

  formatDateMMMDD(date) {
    return date != null ? moment(date).format('MMM-DD') : null;
  }

  subtract(date, amount, type){
    return moment(date).subtract(amount , type).format('YYYY-MM-DD');
  }

  periodSelected(period){    
    let selectedToDate = this.formatDate(new Date());
    let selectedFromDate = '';

    if(period == Period.lastweek){
      selectedFromDate = this.subtract(new Date(), 7, 'days');
    }
    if(period == Period.last2weeks){
      selectedFromDate = this.subtract(new Date(), 14, 'days');
    }
    if(period == Period.lastmonth){
      selectedFromDate = this.subtract(new Date(), 1, 'months');
    }
    if(period == Period.lastquarter){
      selectedFromDate = this.subtract(new Date(), 3, 'months');
    }
    if(period == Period.lastyear){
      selectedFromDate = this.subtract(new Date(), 1, 'years');
    }
    if(period == Period.alltime){
      selectedFromDate = this.formatDate(new Date('2016-01-01'));
    }

    return {"fromDate": selectedFromDate, "toDate": selectedToDate}
  }
}
