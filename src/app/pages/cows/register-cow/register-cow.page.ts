import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';

@Component({
  selector: 'app-register-cow',
  templateUrl: './register-cow.page.html',
  styleUrls: ['./register-cow.page.scss'],
  providers: [Keyboard]
})
export class RegisterCowPage extends CowBaseComponent implements OnInit {  

  constructor(router: Router, formBuilder: FormBuilder, storage: Storage, cowService: CowService, 
    datePicker: DatepickerService, keyboard: Keyboard) { 
      super(router, formBuilder, storage, cowService, datePicker, keyboard);
    }

  ngOnInit() {
    this.getFarmId();
    this.cowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      farmId: this.farmId,
      tagnumber: [null, [Validators.maxLength(50)]],
      birthdate: [null],
      cowtype: [null, [Validators.required]],
      breed: [null],
      cowstatus: [null, [Validators.required]]
    }); 
  }
  
  onSubmit() {
    if(this.cowForm.valid){
      this.cowForm.controls['farmId'].setValue(this.farmId);

      this.cowService.registerCow(this.cowForm.getRawValue()).then(val => {
        if(val){
          this.cowService.cowListState.next(true);
          this.router.navigateByUrl('/tabs/herd');
        }
      });
    }    
  }

  async openDatePicker(){    
    let birthDate = await this.datePicker.openDatePicker(this.fromDate, this.toDate, '');
    this.cowForm.controls['birthdate'].setValue(birthDate);    
  }
}
