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
  private email: string;
  private passwordResetCode: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, 
    private authService: AuthService) { 
      this.activatedRoute.queryParams.subscribe(() => {
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
          this.email = state.resetData.email;
          this.passwordResetCode = state.resetData.passwordResetCode;
        }
      });
    }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    }, { 
      validator: this.checkPasswords.bind(this)
    });
  }

  onSubmit() {
    var body = {'Email': this.email, 'Password': this.resetPasswordForm.controls.password.value, 'PasswordResetCode': this.passwordResetCode};

    this.authService.resetPassword(body).subscribe(val => {
      if(val){
        this.router.navigateByUrl('/login');
      }
      
    });
  }

  checkPasswords(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: repeatedPassword } = formGroup.get('repeatedPassword');
    return password === repeatedPassword ? null : { passwordNotMatch: true };
  }
}
