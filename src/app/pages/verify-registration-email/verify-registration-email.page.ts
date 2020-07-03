import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-verify-registration-email',
  templateUrl: './verify-registration-email.page.html',
  styleUrls: ['./verify-registration-email.page.scss'],
})
export class VerifyRegistrationEmailPage implements OnInit {
  
  protected confirmEmailForm: FormGroup;
  protected email: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService) {
    this.activatedRoute.queryParams.subscribe(() => {
      let state = this.router.getCurrentNavigation().extras.state;
      if (state) {
        this.email = state.email;
      }
    });
   }

  ngOnInit() {}

  onSubmit(verificationCode) {
    let resetData = {
      email: this.email,
      emailConfirmationCode: verificationCode
    };

    this.authService.confirmEmail(resetData).subscribe();
  }

  resendConfirmationCode(){
    var body = {
      'email': this.email
    };
    this.authService.resendConfirmationCode(body).subscribe();
  }
}
