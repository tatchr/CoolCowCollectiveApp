import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {    
  loginForm: FormGroup;

  showSpinner: boolean = false;
  loading;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      //this.loading.dismiss();
    });

    // this.loadingCtrl.create({
    //   message: 'Authenticating...'
    // }).then((overlay) => {
    //   this.loading = overlay;
    //   this.loading.present();
    // }).then(() => {
      
    // });

        
  }

  register() {
    this.authService.registerUser(this.loginForm.value).subscribe(res => {
      // Call Login to automatically login the new user
      this.authService.login(this.loginForm.value).subscribe();
    });
  }  
}
