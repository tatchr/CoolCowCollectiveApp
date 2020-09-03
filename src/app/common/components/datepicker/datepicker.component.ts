import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {

  @Input() position: string;
  @Input() addIcon: boolean;
  @Input() label: string;
  @Input() date: Date;
  @Output() dateChange = new EventEmitter<Date>();

  constructor(public datePickerService: DatepickerService) { }

  ngOnInit() {
    if(!this.date){
      this.date = this.datePickerService.today;
    }
  }

  protected async openDatepicker(){
    this.date = await this.datePickerService.openDatePicker(this.date);    
  }

  protected emitDate(date: Date){
    this.dateChange.emit(date)
  }
}
