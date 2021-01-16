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

  // onSubmit() {
  //   this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(response => {
  //     const { value: email } = this.forgotPasswordForm.get('email');
  //     let navigationExtras: NavigationExtras = {
  //       state: {
  //         email: email
  //       }
  //     };      
      
  //     console.log(response);

  //     if(response.status == 204){
  //       this.router.navigate(['verify-recovery-email'], navigationExtras);
  //     }
  //     else if(response.status == 200 && response.body['userNeedsToBeConfirmed']){
  //       this.router.navigate(['verify-registration-email'], navigationExtras);
  //     }
  //   });
  // }

  onSubmit() {
    const { value: email } = this.forgotPasswordForm.get('email');
    let navigationExtras: NavigationExtras = {
      state: {
        email: email
      }
    }; 

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(response => {
      if(response.status == 204){
        this.router.navigate(['verify-recovery-email'], navigationExtras);
      }
      
    },
    errorResponse => {
      if(errorResponse.status == 409){
        this.router.navigate(['verify-registration-email'], navigationExtras);
      }
    });
  }
}
