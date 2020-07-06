import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { VerificationCodeInputComponent } from 'src/app/common/components/verification-code-input/verification-code-input.component';

@Component({
  selector: 'app-verify-registration-email',
  templateUrl: './verify-registration-email.page.html',
  styleUrls: ['./verify-registration-email.page.scss'],
})
export class VerifyRegistrationEmailPage implements OnInit {
  @ViewChild(VerificationCodeInputComponent) verificationCodeComponent: VerificationCodeInputComponent;
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

  ngOnInit() { }

  protected onSubmit(verificationCode) {
    let resetData = {
      email: this.email,
      emailConfirmationCode: verificationCode
    };

    this.authService.confirmEmail(resetData).then((val) => {
      this.authService.setUserAndJwtToken(val);
    }).catch(() => {
      this.verificationCodeComponent.reset();
    });
  }

  protected resendConfirmationCode() {
    var body = {
      'email': this.email
    };
    this.authService.resendConfirmationCode(body).then();
  }
}
