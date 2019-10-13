import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  userId: number;
  changePasswordForm: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, 
    private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.storage.get('userId').then(userId => {
      this.userId = userId;
    });

    this.initiateForm();
  }

  initiateForm(){
    this.changePasswordForm = this.formBuilder.group({
      userId: [this.userId],
      oldpassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      newpassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      repeatedNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), this.passwordMatcher.bind(this)]]
    });
  }

  onSubmit() {    
    if(this.changePasswordForm.valid){
      this.changePasswordForm.controls['userId'].setValue(this.userId);
      this.accountService.changePassword(this.changePasswordForm.value).subscribe(val => {
        if(val){
          this.router.navigateByUrl('/account');
        }
      });
    }    
  }

  checkPasswords(group: FormGroup) {
    var password = group.controls.newpassword.value;
    var repeatedPassword = group.controls.repeatedNewPassword.value;

    return password !== repeatedPassword 
      ? { passwordNotMatch: true }   
      : null;   
  }

  passwordMatcher(group: FormGroup): { [s: string]: boolean }{
    var repeatedPassword = group.value;

    return this.changePasswordForm && this.changePasswordForm.controls.newpassword.value !== repeatedPassword
      ? { passwordNotMatch: true } 
      : null;
  }

}
