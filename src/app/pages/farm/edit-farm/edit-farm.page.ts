import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { FarmService } from 'src/app/services/farm/farm.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { UserDetails } from 'src/app/common/objects/UserDetails';

@Component({
  selector: 'app-edit-farm',
  templateUrl: './edit-farm.page.html',
  styleUrls: ['./edit-farm.page.scss'],
})
export class EditFarmPage implements OnInit {

  protected farmForm: FormGroup;

  constructor(private accountService: AccountService, private farmService: FarmService, 
    private formBuilder: FormBuilder, private toastController: ToastController) { }

    protected user: UserDetails;
    protected farm: FarmDetails;

    ngOnInit() {
      this.accountService.getUser().then((user: UserDetails) => {
        this.farmService.getFarm().then((farm: FarmDetails) => {         
          this.farmForm = this.formBuilder.group({
            userId: user.id,
            farmId: farm.farmId,
            name: [farm.name, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            email: [farm.email, [Validators.email, Validators.maxLength(255)]],
            phonenumber: [farm.phoneNumber, Validators.maxLength(50)],
            address: [farm.address, [Validators.minLength(1), Validators.maxLength(255)]],
            county: [farm.county, [Validators.minLength(1), Validators.maxLength(100)]],
            country: [farm.country, [Validators.minLength(1), Validators.maxLength(100)]],
            description: [farm.description, [Validators.minLength(1), Validators.maxLength(300)]],
            registrationDate: [farm.registrationDate],
            updateDate: [farm.updateDate]
          });     
        });
      });      
    }
  
    protected updateFarm() {
      if (this.farmForm.valid) {
        let updatedFarm: FarmDetails = {
          farmId: this.farmForm.value['farmId'],
          name: this.farmForm.value['name'],
          email: this.farmForm.value['email'],
          userId: this.farmForm.value['userId'],
          phoneNumber: this.farmForm.value['phonenumber'],
          address: this.farmForm.value['address'],
          county: this.farmForm.value['county'],
          country: this.farmForm.value['country'],
          description: this.farmForm.value['description'],
          registrationDate: this.farmForm.value['registrationDate'],
          updateDate: this.farmForm.value['updateDate'],
          userRole: null
        };

        this.farmService.updateFarm(updatedFarm).then(() => {          
            this.toast('Farm details updated!');          
        });
      }    
    }
  
    private toast(message){
      let toast = this.toastController.create({
        message: message,
        duration: 2000,
        showCloseButton: true,
        color: 'medium'
      });
      toast.then(toast => toast.present());
    }

}
