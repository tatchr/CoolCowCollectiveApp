import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-verify-registration-email',
  templateUrl: './verify-registration-email.page.html',
  styleUrls: ['./verify-registration-email.page.scss'],
})
export class VerifyRegistrationEmailPage implements OnInit {

  confirmEmailForm: FormGroup;
  email = null;

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
    this.confirmEmailForm = this.formBuilder.group({
      email: [this.email],
      emailConfirmationCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });  

    
    console.log(this.email);
  }

  onSubmit() {
    this.authService.confirmEmail(this.confirmEmailForm.value).subscribe(val => {
      if(val){
        console.log(val);
        //this.router.navigateByUrl('/verify-registration-email/' + this.newUserForm.controls.email.value);
      }
      
    });
  }

  resendConfirmationCode(){
    var body = {'Email': this.email};
    this.authService.resendConfirmationCode(body).subscribe();
  }

}
