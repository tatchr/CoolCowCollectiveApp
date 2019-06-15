import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
      email: [this.email],
      passwordResetCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    this.authService.verifyPasswordResetCode(this.verifyEmailForm.value).subscribe(val => {
      if(val){
        console.log(val);
        this.router.navigateByUrl('/reset-password/' + this.email + '/' + this.verifyEmailForm.controls.passwordResetCode.value);
      }
      
    });
  }

  resendPasswordResetCode(){
    var body = {'Email': this.email};
    this.authService.resendPasswordResetCode(body).subscribe();
  }

}
