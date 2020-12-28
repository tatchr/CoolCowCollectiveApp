import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { PeriodDetails } from '../../objects/PeriodDetails';
import { Period } from '../../objects/Enums';

@Component({
  selector: 'period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
})
export class PeriodSelectorComponent implements OnInit {

  @Output() fromDateChange = new EventEmitter<string>();
  @Output() returnPeriod = new EventEmitter<Period>();
  
  selectedPeriod: Period = Period.lastweek;

  periods: Array<PeriodDetails> = [
    new PeriodDetails({value: Period.lastweek, label: '1 week'}),
    new PeriodDetails({value: Period.last2weeks, label: '2 weeks'}),
    new PeriodDetails({value: Period.lastmonth, label: '1 month'}),
    new PeriodDetails({value: Period.lastquarter, label: '3 months'}),
    new PeriodDetails({value: Period.lastyear, label: '1 year'}),
    new PeriodDetails({value: Period.alltime, label: 'All time'})
  ];

  constructor(public datePickerService: DatepickerService) { }

  ngOnInit() {}

  public periodSelected(period: Period){
    this.selectedPeriod = period;
    let fromDate: string = null;

    switch (period) {
      case Period.lastweek:
        fromDate = this.datePickerService.subtract(new Date(), 7, 'days');
        break;
      case Period.last2weeks:
        fromDate = this.datePickerService.subtract(new Date(), 14, 'days');
        break;
      case Period.lastmonth:
        fromDate = this.datePickerService.subtract(new Date(), 1, 'months');
        break;
      case Period.lastquarter:
        fromDate = this.datePickerService.subtract(new Date(), 3, 'months');
        break;
      case Period.lastyear:
        fromDate = this.datePickerService.subtract(new Date(), 1, 'years');
        break;
      case Period.alltime:
        fromDate = this.datePickerService.minDate;
        break;       
      default:
        break;
    }    

    this.fromDateChange.emit(fromDate);
    this.returnPeriod.emit(period);
  }
}
