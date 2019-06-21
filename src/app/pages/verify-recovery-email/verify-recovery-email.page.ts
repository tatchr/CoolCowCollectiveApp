import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-verify-recovery-email',
  templateUrl: './verify-recovery-email.page.html',
  styleUrls: ['./verify-recovery-email.page.scss'],
})
export class VerifyRecoveryEmailPage implements OnInit {

  verifyEmailForm: FormGroup;
  email = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
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

    this.authService.verifyPasswordResetCode(resetData).subscribe(val => {
      if (val) {
        this.router.navigateByUrl('/reset-password/' + this.email + '/' + passwordResetCode);
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
