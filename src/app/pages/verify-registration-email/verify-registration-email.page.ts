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
      n1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    });
  }

  onSubmit() {
    let emailConfirmationCode = this.confirmEmailForm.controls.n1.value + '' + this.confirmEmailForm.controls.n2.value + '' 
      + this.confirmEmailForm.controls.n3.value + '' + this.confirmEmailForm.controls.n4.value + ''
      + this.confirmEmailForm.controls.n5.value + '' + this.confirmEmailForm.controls.n6.value;

    let resetData = {
      email: this.email,
      emailConfirmationCode: emailConfirmationCode
    };

    this.authService.confirmEmail(resetData).subscribe();
  }

  resendConfirmationCode(){
    var body = {'Email': this.email};
    this.authService.resendConfirmationCode(body).subscribe();
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
