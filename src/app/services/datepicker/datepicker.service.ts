import { Injectable } from '@angular/core';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {

  constructor(public modalCtrl: ModalController) { }

  getDatepickerObj(userInputDate, fromDate, toDate){
    return {
      inputDate: userInputDate, // default new Date()
      fromDate: fromDate, // default null
      toDate: toDate, // default null
      showTodayButton: true, // default true
      closeOnSelect: false, // default false
      disableWeekDays: [], // default []
      mondayFirst: true, // default false
      setLabel: 'Select',  // default 'Set'
      todayLabel: 'Today', // default 'Today'
      closeLabel: 'Close', // default 'Close'
      disabledDates: [], // default []
      titleLabel: 'Select a Date', // default null
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
      clearButton: true, // default true
      momentLocale: 'pt-BR', // Default 'en-US'
      yearInAscending: true, // Default false
      btnCloseSetInReverse: true, // Default false
      btnProperties: {
        expand: 'block', // Default 'block'
        fill: '', // Default 'solid'
        size: '', // Default 'default'
        disabled: '', // Default false
        strong: '', // Default false
        color: '' // Default ''
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
}
