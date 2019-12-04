import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-cow-base',
  templateUrl: './cow-base.component.html',
  styleUrls: ['./cow-base.component.scss'],
})
export class CowBaseComponent implements OnInit {

  cowForm: FormGroup;
  showFullStatusList: boolean;
  farmId: string;

  fromDate = new Date('1970-01-01');
  toDate = this.datePicker.formatDate(new Date());

  constructor(protected router: Router, protected formBuilder: FormBuilder, 
    protected storage: Storage, protected cowService: CowService, protected datePicker: DatepickerService, public keyboard: Keyboard) { }

  ngOnInit() {}

  getFarmId(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId; 
    });
  } 

  cowTypeSelected(event) {
    this.setCowStatusList(event.detail.value);
    // this.showFullStatusList = event.detail.value == 'Cow';

    // if(!this.showFullStatusList){
    //   this.cowForm.controls['cowstatus'].setValue('N/A');
    //   this.cowForm.controls['cowstatus'].disable();
    // }
    // else{
    //   this.cowForm.controls['cowstatus'].enable();
    // }
  }

  setCowStatusList(cowType){
    this.showFullStatusList = cowType == 'Cow';

    if(!this.showFullStatusList){
      this.cowForm.controls['cowstatus'].setValue('N/A');
      this.cowForm.controls['cowstatus'].disable();
    }
    else{
      this.cowForm.controls['cowstatus'].enable();
    }
  }
}
