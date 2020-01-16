import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
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

  cowId: number;
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
    this.populateForm(this.cowDetails);
    this.cowId = this.cowDetails.id;
  }

  populateForm(cowDetails) {
    this.cowForm = this.formBuilder.group({
      id: cowDetails.id,
      name: [cowDetails.name, [Validators.required, Validators.maxLength(100)]],
      farmId: cowDetails.farmId,
      tagnumber: [cowDetails.tagNumber, [Validators.maxLength(50)]],
      birthdate: this.datePicker.formatDate(cowDetails.birthDate),
      cowtype: [cowDetails.cowType, [Validators.required]],
      breed: cowDetails.breed,
      cowstatus: [cowDetails.cowStatus, [Validators.required, Validators.maxLength(100)]],
      cowstate: cowDetails.cowState,
      registrationdate: cowDetails.registrationDate
    });

    this.setCowStatusList(cowDetails.cowType);
  }

  updateCow() {
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
        registrationDate: this.cowForm.value['registrationdate']
      };

      this.cowService.updateCow(this.cowForm.getRawValue()).subscribe(val => {
        if (val) {
          this.cowService.cowUpdated.next(updatedCow);
          this.router.navigateByUrl('tabs/herd');
        }
      });
    }
  }

  async openDatePicker() {
    let birthDate = this.cowForm.controls['birthdate'].value;
    birthDate = await this.datePicker.openDatePicker(this.fromDate, this.toDate, birthDate);
    this.cowForm.controls['birthdate'].setValue(birthDate);
  }
}
