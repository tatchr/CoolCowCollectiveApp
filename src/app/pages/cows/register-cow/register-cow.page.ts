import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';
import { FarmService } from 'src/app/services/farm/farm.service';

@Component({
  selector: 'app-register-cow',
  templateUrl: './register-cow.page.html',
  styleUrls: ['./register-cow.page.scss'],
  providers: [Keyboard]
})
export class RegisterCowPage extends CowBaseComponent implements OnInit {   

  constructor(router: Router, formBuilder: FormBuilder, storage: Storage, cowService: CowService, 
    datePicker: DatepickerService, keyboard: Keyboard, farmService: FarmService) { 
      super(router, formBuilder, storage, cowService, datePicker, keyboard, farmService);
    }

  ngOnInit() {
    this.getFarmId();
    this.cowForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(50)]],
      farmId: this.farmId,
      tagnumber: [null, [Validators.maxLength(50)]],
      birthdate: [null],
      cowtype: [null, [Validators.required]],
      breed: [null],
      cowstatus: [null, [Validators.required]],
      lactatingsincedate: [null],
      registrationDate: [null]
    }); 
  }
  
  onSubmit() {
    if(this.cowForm.valid){
      this.cowForm.controls['farmId'].setValue(this.farmId);
      this.cowForm.controls['registrationDate'].setValue(new Date());

      this.cowService.registerCow(this.cowForm.getRawValue()).then(val => {
        if(val){
          this.cowService.cowRegistered.next(val['cow']);
          this.router.navigateByUrl('/tabs/herd');
        }
      });
    }    
  }

  async openDatePicker(field){
    let date = await this.datePicker.openDatePicker(null);
    this.cowForm.controls[field].setValue(date);    
  }
}
