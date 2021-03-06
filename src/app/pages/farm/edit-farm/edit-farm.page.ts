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

  farmForm: FormGroup;

  constructor(private accountService: AccountService, private farmService: FarmService, 
    private formBuilder: FormBuilder, private toastController: ToastController) { }

    ngOnInit() {
      this.accountService.getUser().then((user: UserDetails) => {
        this.farmService.getFarm().then((farm: FarmDetails) => {         
          this.farmForm = this.formBuilder.group({
            userId: user.id,
            id: farm.id,
            name: [farm.name, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
            email: [farm.email, [Validators.email, Validators.maxLength(255)]],
            phonenumber: [farm.phoneNumber, Validators.maxLength(50)],
            address: [farm.address, [Validators.minLength(1), Validators.maxLength(255)]],
            county: [farm.county, [Validators.minLength(1), Validators.maxLength(100)]],
            country: [farm.country, [Validators.minLength(1), Validators.maxLength(100)]],
            description: [farm.description, [Validators.minLength(1), Validators.maxLength(300)]]
          });     
        });
      });      
    }
  
    updateFarm() {
      this.farmService.updateFarm(this.farmForm.value).subscribe(response => {
        if(response.status == 200){
          this.farmService.setFarm(response.body['farm'])
            .then(() => this.toast('Farm details updated!'));          
        }
      });
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
