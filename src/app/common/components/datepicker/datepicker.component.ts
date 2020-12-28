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
  @Input() date: string;
  @Input() disabled: Boolean;
  @Output() dateChange = new EventEmitter<string>();

  constructor(public datePickerService: DatepickerService) { }

  ngOnInit() {
    if(!this.date){
      this.date = this.datePickerService.today;
    }
  }

  async openDatepicker(){
    this.date = await this.datePickerService.openDatePicker(this.date);    
  }

  emitDate(date: string){
    this.dateChange.emit(date)
  }
}
