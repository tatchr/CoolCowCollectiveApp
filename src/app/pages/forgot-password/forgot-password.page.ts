import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(val => {
      if(val){
        const { value: email } = this.forgotPasswordForm.get('email');
        let navigationExtras: NavigationExtras = {
          state: {
            email: email
          }
        };      
        
        if(val['userNeedsToBeConfirmed']){
          this.router.navigate(['verify-registration-email'], navigationExtras);
        }
        else{
          this.router.navigate(['verify-recovery-email'], navigationExtras);
        }
      }      
    });
  }
}
