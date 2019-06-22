import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  newUserForm: FormGroup;
  gen: String;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.newUserForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      gender: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      phonenumber: ['', Validators.maxLength(50)],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), this.passwordMatcher.bind(this)]]
    }, { validator: this.checkPasswords });
  }

  onSubmit() {
    this.authService.registerUser(this.newUserForm.value).subscribe(val => {
      if(val){
        console.log(val);
        this.router.navigateByUrl('/verify-registration-email/' + this.newUserForm.controls.email.value);
      }
      
    });
  }

  checkPasswords(group: FormGroup) {
    var password = group.controls.password.value;
    var repeatedPassword = group.controls.repeatedPassword.value;

    return password !== repeatedPassword 
      ? { passwordNotMatch: true }   
      : null;   
  }

  passwordMatcher(group: FormGroup): { [s: string]: boolean }{
    var repeatedPassword = group.value;

    return this.newUserForm && this.newUserForm.controls.password.value !== repeatedPassword
      ? { passwordNotMatch: true } 
      : null;
  }
}
