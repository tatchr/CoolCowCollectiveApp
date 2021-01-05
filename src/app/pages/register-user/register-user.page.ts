import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  newUserForm: FormGroup;
  gen: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.newUserForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      gender: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      phone: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    }, {
      validator: this.checkPasswords.bind(this)
    });
  }

  checkPasswords(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: repeatedPassword } = formGroup.get('repeatedPassword');
    return password === repeatedPassword ? null : { passwordNotMatch: true };
  }
  
  // onSubmit() {
  //   this.authService.registerUser(this.newUserForm.value).then(() => {
  //     const { value: email } = this.newUserForm.get('email');
  //     let navigationExtras: NavigationExtras = {
  //       state: {
  //         email: email
  //       }
  //     };
  //     this.router.navigate(['verify-registration-email'], navigationExtras);
  //   });
  // }

  //TODO: Remove this when email registraion is activated
  onSubmit() {
    this.authService.registerUser(this.newUserForm.value).then(response => {
      this.authService.setUserAndJwtToken(response).then(() =>{
        this.router.navigate(['new-farm'], { replaceUrl: true });
      });
    });
  }
}
