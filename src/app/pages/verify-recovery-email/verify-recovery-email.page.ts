import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-verify-recovery-email',
  templateUrl: './verify-recovery-email.page.html',
  styleUrls: ['./verify-recovery-email.page.scss'],
})
export class VerifyRecoveryEmailPage implements OnInit {

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

  ngOnInit() {
    this.verifyEmailForm = this.formBuilder.group({
      n1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    });
  }

  onSubmit() {
    let passwordResetCode = this.verifyEmailForm.controls.n1.value + '' + this.verifyEmailForm.controls.n2.value + '' 
      + this.verifyEmailForm.controls.n3.value + '' + this.verifyEmailForm.controls.n4.value + ''
      + this.verifyEmailForm.controls.n5.value + '' + this.verifyEmailForm.controls.n6.value;

    let resetData = {
      email: this.email,
      passwordResetCode: passwordResetCode
    };

    let navigationExtras: NavigationExtras = {
      state: {
        resetData: resetData
      }
    };

    this.authService.verifyPasswordResetCode(resetData).subscribe(val => {
      if (val) {
        this.router.navigate(['reset-password'], navigationExtras);
      }
    });
  }

  resendPasswordResetCode() {
    var body = { 'Email': this.email };
    this.authService.resendPasswordResetCode(body).subscribe();
  }

  checkInput(element, nextElement){
    let input = element.value;
    if(input != null && input != ""){
      if(input.length > 1){
        element.value = null;
      }
      else{        
        if(nextElement != null){
          nextElement.setFocus();
        }
      }
    }    
  }
}
