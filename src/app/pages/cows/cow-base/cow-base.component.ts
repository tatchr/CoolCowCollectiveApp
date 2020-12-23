import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { CowStatus } from 'src/app/common/objects/Enums';

@Component({
  selector: 'app-cow-base',
  templateUrl: './cow-base.component.html',
  styleUrls: ['./cow-base.component.scss'],
})
export class CowBaseComponent implements OnInit {

  cowForm: FormGroup;
  showFullStatusList: boolean;
  showLactatingSinceDate: boolean;
  farmId: string;

  fromDate = new Date('1970-01-01');
  toDate = this.datePicker.formatDate(new Date());

  cowSatuses: CowStatus[] = [ CowStatus.Lactating, CowStatus.NonLactating, CowStatus.NA ]

  constructor(public router: Router, public formBuilder: FormBuilder, 
    storage: Storage, public cowService: CowService, public datePicker: DatepickerService, 
    public keyboard: Keyboard, public farmService: FarmService) { }

  ngOnInit() {}

  getFarmId(){
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id; 
    });
  }

  cowTypeSelected(event) {
    this.setCowStatusList(event.detail.value);
  }

  setCowStatusList(cowType){
    this.showFullStatusList = cowType == 'Cow';

    if(!this.showFullStatusList){
      this.cowForm.controls['cowstatus'].setValue(CowStatus.NA);
      this.cowForm.controls['cowstatus'].disable();
    }
    else{
      this.cowForm.controls['cowstatus'].enable();
    }
  }

  cowStatusSelected(event){
    this.setLactatingSinceDate(event.detail.value);
  }

  setLactatingSinceDate(cowStatus){
    this.showLactatingSinceDate = cowStatus == 'Lactating';

    if(!this.showLactatingSinceDate){
      this.cowForm.controls['lactatingsincedate'].setValue(null);
    }
  }
}
