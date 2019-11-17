import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';

@Component({
  selector: 'app-cow-passport',
  templateUrl: './cow-passport.page.html',
  styleUrls: ['./cow-passport.page.scss'],
  providers: [Keyboard]
})
export class CowPassportPage extends CowBaseComponent implements OnInit {
  
  cowId: string;

  constructor(router: Router, private activatedRoute: ActivatedRoute, formBuilder: FormBuilder, storage: Storage, 
    cowService: CowService, datePicker: DatepickerService, keyboard: Keyboard) {
      super(router, formBuilder, storage, cowService, datePicker, keyboard);
     }

  ngOnInit() {
    this.initiate();
  }

  initiate(){
    this.cowId = this.activatedRoute.snapshot.paramMap.get('cowId');
    this.getFarmId();
    this.getCow();
  }

  getCow(){
    this.cowService.getCow(this.cowId).subscribe(res => {
      this.populateForm(res['cow']);
    });
  }  
  
  populateForm(cowDetails){
    this.cowForm = this.formBuilder.group({
      id: this.cowId,
      name: [cowDetails.name, [Validators.required, Validators.maxLength(100)]],
      farmId: this.farmId,
      tagnumber: [cowDetails.tagNumber, [Validators.maxLength(50)]],
      birthdate: this.datePicker.formatDate(cowDetails.birthDate),
      cowtype: [cowDetails.cowType, [Validators.required]],
      breed: cowDetails.breed,
      cowstatus: [cowDetails.cowStatus, [Validators.required, Validators.maxLength(100)]],
      cowstate: cowDetails.cowState,
      registrationdate: cowDetails.registrationDate     
    });

    this.setCowStatusList(cowDetails.cowType);

    // this.showFullStatusList = cowDetails.cowType == 'Cow';    

    // if(!this.showFullStatusList){
    //   this.cowForm.controls['cowstatus'].setValue('N/A');
    //   this.cowForm.controls['cowstatus'].disable();
    // }
  }

  updateCow() {
    if(this.cowForm.valid){
      this.cowService.updateCow(this.cowForm.getRawValue()).subscribe(val => {
        if(val){
          this.cowService.cowListState.next(true);
          this.router.navigateByUrl('tabs/herd');
        }
      });
    }    
  }

  async openDatePicker(){
    let birthDate = this.cowForm.controls['birthdate'].value;
    birthDate = await this.datePicker.openDatePicker(this.fromDate, this.toDate, birthDate);
    this.cowForm.controls['birthdate'].setValue(birthDate);    
  }
}
