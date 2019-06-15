import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  email = null;
  passwordResetCode = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
    this.passwordResetCode = this.activatedRoute.snapshot.paramMap.get('passwordResetCode');
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), this.passwordMatcher.bind(this)]]
    },  { validator: this.checkPasswords });
  }

  onSubmit() {
    var body = {'Email': this.email, 'Password': this.resetPasswordForm.controls.password.value, 'PasswordResetCode': this.passwordResetCode};

    this.authService.resetPassword(body).subscribe(val => {
      if(val){
        console.log(val);
        this.router.navigateByUrl('/login');
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

    return this.resetPasswordForm && this.resetPasswordForm.controls.password.value !== repeatedPassword
      ? { passwordNotMatch: true } 
      : null;
  }

}
