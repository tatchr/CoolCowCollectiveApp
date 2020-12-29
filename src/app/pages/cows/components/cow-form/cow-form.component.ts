import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { Animal, CowState, CowStatus } from 'src/app/common/objects/Enums';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'cow-form',
  templateUrl: './cow-form.component.html',
  styleUrls: ['./cow-form.component.scss'],
})
export class CowFormComponent implements OnInit {

  @Input() cowDetails: CowDetails;
  @Input() isExistingRecord: boolean;
  @Output() returnform = new EventEmitter<FormGroup>();
  @Output() delete = new EventEmitter<string>();

  cowForm: FormGroup;
  cowTypes: Animal[] = [Animal.Cow, Animal.Heifer, Animal.Calf, Animal.Bull ];
  cowSatuses: CowStatus[] = [CowStatus.Lactating, CowStatus.NonLactating, CowStatus.NA]
  cowStates: CowState[] = [CowState.InHerd, CowState.Sold, CowState.Deceased, CowState.Deleted];

  constructor(private formBuilder: FormBuilder, public datePicker: DatepickerService) { }

  ngOnInit() {
    this.cowForm = this.createForm(this.cowDetails);
    this.setCowStatusList(this.cowDetails.cowType);
    this.setLactatingSinceDate(this.cowDetails.cowStatus);
  }

  private createForm(cow: CowDetails){
    let form = this.formBuilder.group({
      name: [cow.name, [Validators.required, Validators.maxLength(50)]],
      farmId: cow.farmId,
      tagnumber: [cow.tagNumber, [Validators.maxLength(50)]],
      birthdate: [cow.birthDate],
      cowtype: [cow.cowType, [Validators.required]],
      breed: [cow.breed],
      cowstatus: [cow.cowStatus, [Validators.required]],
      lactatingsincedate: [cow.lactatingSinceDate]
    });

    if(cow.id){
      form.addControl('id', new FormControl(cow.id));
    }

    if(this.isExistingRecord){
      form.addControl('cowstate', new FormControl({ value: cow.cowState, disabled: true }));
    }

    return form;
  }

  private setLactatingSinceDate(cowStatus){
    if(cowStatus == CowStatus.Lactating){
      this.cowForm.get('lactatingsincedate').enable();
    }
    else{
      this.cowForm.get('lactatingsincedate').setValue(null);
      this.cowForm.get('lactatingsincedate').disable();
    }
  }

  private setCowStatusList(cowType){
    if(cowType && cowType != Animal.Cow){
      this.cowForm.get('cowstatus').setValue(CowStatus.NA);
      this.cowForm.get('cowstatus').disable();
    }
    else{
      this.cowForm.get('cowstatus').enable();
    }
  }

  cowTypeSelected(event){
    let cowType = event.detail.value;
    this.setCowStatusList(cowType);
  }

  cowStatusSelected(event){
    let cowStatus = event.detail.value;
    this.setLactatingSinceDate(cowStatus);
  }

  get cowNotInHerd(){
    return this.isExistingRecord && this.cowForm.get('cowstate').value != CowState.InHerd;
  }

  get cowInHerd(){
    return this.isExistingRecord && this.cowForm.get('cowstate').value == CowState.InHerd;
  }

  emitform(form: FormGroup){
    this.returnform.emit(form);
  }

  deletecow(form: FormGroup){
    let cowId = form.get('id').value;

    this.delete.emit(cowId);
  }

  async openDatePicker(key){
    let date = await this.datePicker.openDatePicker(null);
    this.cowForm.controls[key].setValue(date);
  }
}
