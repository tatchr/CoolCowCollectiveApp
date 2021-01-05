import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { ToastController } from '@ionic/angular';
import { UserDetails } from 'src/app/common/objects/UserDetails';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  userForm: FormGroup;
  gen: string;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private toastController: ToastController) { }

  ngOnInit() {    
    this.accountService.getUser().then((user: UserDetails) => {
      this.gen = user.gender;
      this.userForm = this.formBuilder.group({
        id: user.id,
        firstname: [user.firstName, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        lastname: [user.lastName, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        email: [user.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
        gender: [user.gender, [Validators.required]],
        phonenumber: [user.phoneNumber, Validators.maxLength(50)]
      });
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.accountService.getUser().then((user: UserDetails) => {
        user.firstName = this.userForm.value['firstname'];
        user.lastName = this.userForm.value['lastname'];
        user.email = this.userForm.value['email'];
        user.gender = this.userForm.value['gender'];
        user.phoneNumber = this.userForm.value['phonenumber'];

        this.accountService.updateUserDetails(user).subscribe(val => {
          if (val) {
            this.accountService.setUser(user);
            this.toast('Account details updated!');
          }
        });
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
