import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {    
  loginForm: FormGroup; 

  constructor(private router: Router,  private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).then(res => {
      if(res['userNeedsToBeConfirmed']){
        let navigationExtras: NavigationExtras = {
          state: {
            email: this.loginForm.value['email']
          }
        };
        this.router.navigate(['verify-registration-email'], navigationExtras);
      }
      else{
        this.authService.setUserAndJwtToken(res)
      }
    });
  }

  register() {
    this.authService.registerUser(this.loginForm.value).then(() => {      
      this.authService.login(this.loginForm.value);
    });
  }  
}
