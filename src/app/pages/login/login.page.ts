import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {    
  loginForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email1: ['', [Validators.required, Validators.maxLength(1)]],
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe();    
  }

  register() {
    this.authService.registerUser(this.loginForm.value).subscribe(res => {
      // Call Login to automatically login the new user
      this.authService.login(this.loginForm.value).subscribe();
    });
  }  
}
