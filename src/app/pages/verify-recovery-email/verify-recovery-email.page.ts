import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { VerificationCodeInputComponent } from 'src/app/common/components/verification-code-input/verification-code-input.component';

@Component({
  selector: 'app-verify-recovery-email',
  templateUrl: './verify-recovery-email.page.html',
  styleUrls: ['./verify-recovery-email.page.scss'],
})
export class VerifyRecoveryEmailPage implements OnInit {

  @ViewChild(VerificationCodeInputComponent) verificationCodeComponent: VerificationCodeInputComponent;

  protected verifyEmailForm: FormGroup;
  protected email: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
     private authService: AuthService) { 
      this.activatedRoute.queryParams.subscribe(() => {
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
          this.email = state.email;
        }
      });
    }

  ngOnInit() {}

  protected onSubmit(resetCode) {
    let resetData = {
      email: this.email,
      passwordResetCode: resetCode
    };    

    let navigationExtras: NavigationExtras = {
      state: {
        resetData: resetData
      }
    };

    this.authService.verifyPasswordResetCode(resetData).then(() => {      
        this.router.navigate(['reset-password'], navigationExtras);      
    }).catch(() => {
      this.verificationCodeComponent.reset();
    });
  }

  protected resendPasswordResetCode() {
    var body = { 
      'email': this.email 
    };
    this.authService.resendPasswordResetCode(body).then();
  }
}
