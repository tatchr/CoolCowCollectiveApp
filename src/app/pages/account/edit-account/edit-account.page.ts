import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/services/account/account.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  userId: number;
  userForm: FormGroup;
  gen: string;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder,
    private storage: Storage, private router: Router, private toastController: ToastController) { }

  ngOnInit() {    
    this.initiate();
  }

  initiate() {
    this.storage.get('userId').then(userId => {
      this.userId = userId;
      this.getUserDetails();
    });    
  }  

  getUserDetails(){
    this.accountService.getUserDetails(this.userId).subscribe(res => {
        this.populateForm(res['userDetails']);      
    });
  }

  populateForm(userDetails){
    this.gen = userDetails.gender;
    this.userForm = this.formBuilder.group({
      id: this.userId,
      firstname: [userDetails.firstName, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastname: [userDetails.lastName, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: [userDetails.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
      gender: [userDetails.gender, [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      phonenumber: [userDetails.phoneNumber, Validators.maxLength(50)]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userForm.controls['id'].setValue(this.userId);
      this.accountService.updateUserDetails(this.userForm.value).subscribe(val => {
        if (val) {
          this.toast('Account details updated!');
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
