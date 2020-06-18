import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { FarmService } from 'src/app/services/farm/farm.service';

@Component({
  selector: 'app-edit-farm',
  templateUrl: './edit-farm.page.html',
  styleUrls: ['./edit-farm.page.scss'],
})
export class EditFarmPage implements OnInit {

  userId: number;
  farmId: number;
  farmForm: FormGroup;

  constructor(private farmService: FarmService, private formBuilder: FormBuilder,
    private storage: Storage, private router: Router, private toastController: ToastController) { }

    ngOnInit() {    
      this.initiate();
    }
  
    initiate() {
      this.storage.get('farmId').then(farmId => {
        this.farmId = farmId;
        this.getFarmDetails();
      });    
    }  
  
    getFarmDetails(){
      this.farmService.getFarm(this.farmId).then(res => {
          this.populateForm(res['farm']);      
      });
    }
  
    populateForm(farmDetails){
      this.farmForm = this.formBuilder.group({
        userId: this.userId,
        farmId: this.farmId,
        name: [farmDetails.name, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
        email: [farmDetails.email, [Validators.email, Validators.maxLength(255)]],
        phonenumber: [farmDetails.phoneNumber, Validators.maxLength(50)],
        address: [farmDetails.address, [Validators.minLength(1), Validators.maxLength(255)]],
        county: [farmDetails.county, [Validators.minLength(1), Validators.maxLength(100)]],
        country: [farmDetails.country, [Validators.minLength(1), Validators.maxLength(100)]],
        description: [farmDetails.description, [Validators.minLength(1), Validators.maxLength(300)]]
      });
    }
  
    onSubmit() {
      if (this.farmForm.valid) {
        this.farmForm.controls['userId'].setValue(this.userId);
        this.farmForm.controls['farmId'].setValue(this.farmId);
        this.farmService.updateFarm(this.farmForm.value).subscribe(val => {
          if (val) {
            this.toast('Farm details updated!');
          }
        });
      }    
    }
  
    toast(message){
      let toast = this.toastController.create({
        message: message,
        duration: 2000,
        showCloseButton: true,
        color: 'medium'
      });
      toast.then(toast => toast.present());
    }

}
