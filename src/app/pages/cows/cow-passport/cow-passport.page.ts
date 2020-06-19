import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';
import { CowDetails } from 'src/app/common/objects/CowDetails';

@Component({
  selector: 'app-cow-passport',
  templateUrl: './cow-passport.page.html',
  styleUrls: ['./cow-passport.page.scss'],
  providers: [Keyboard]
})
export class CowPassportPage extends CowBaseComponent implements OnInit {
  
  cowDetails: CowDetails;

  constructor(router: Router, private activatedRoute: ActivatedRoute, formBuilder: FormBuilder, storage: Storage,
    cowService: CowService, datePicker: DatepickerService, keyboard: Keyboard) {
    super(router, formBuilder, storage, cowService, datePicker, keyboard);

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.cowDetails = this.router.getCurrentNavigation().extras.state.cowDetails;
      }
    });
  }

  ngOnInit() {
    this.cowForm = this.formBuilder.group({
      id: this.cowDetails.id,
      name: [this.cowDetails.name, [Validators.required, Validators.maxLength(100)]],
      farmId: this.cowDetails.farmId,
      tagnumber: [this.cowDetails.tagNumber, [Validators.maxLength(50)]],
      birthdate: this.datePicker.formatDate(this.cowDetails.birthDate),
      cowtype: [this.cowDetails.cowType, [Validators.required]],
      breed: this.cowDetails.breed,
      cowstatus: [this.cowDetails.cowStatus, [Validators.required, Validators.maxLength(100)]],
      lactatingsincedate: [this.cowDetails.lactatingSinceDate],
      cowstate: this.cowDetails.cowState,
      registrationdate: this.cowDetails.registrationDate,
      updateDate: [null]
    });

    this.setCowStatusList(this.cowDetails.cowType);
    this.setLactatingSinceDate(this.cowDetails.cowStatus);
  }

  updateCow() {
    this.cowForm.controls['updateDate'].setValue(new Date());
    if (this.cowForm.valid) {
      let updatedCow: CowDetails = {
        id: this.cowForm.value['id'],
        name: this.cowForm.value['name'],
        farmId: this.cowForm.value['farmId'],
        tagNumber: this.cowForm.value['tagnumber'],
        birthDate: this.cowForm.value['birthdate'],
        cowType: this.cowForm.value['cowtype'],
        breed: this.cowForm.value['breed'],
        cowStatus: this.cowForm.get(['cowstatus']).value,
        cowState: this.cowForm.value['cowstate'],
        lactatingSinceDate: this.cowForm.value['lactatingsincedate'],
        registrationDate: this.cowForm.value['registrationdate'],
        updateDate: this.cowForm.value['updateDate']
      };

      this.cowService.updateCow(this.cowForm.getRawValue()).subscribe(val => {
        if (val) {
          this.cowService.cowUpdated.next(updatedCow);
          this.router.navigateByUrl('tabs/herd');
        }
      });
    }
  }

  async openDatePicker(field){
    let date = await this.datePicker.openDatePicker('');
    this.cowForm.controls[field].setValue(date);    
  } 
}
