import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-farm',
  templateUrl: './register-farm.page.html',
  styleUrls: ['./register-farm.page.scss'],
})
export class RegisterFarmPage implements OnInit {

  newFarmForm: FormGroup;
  userId: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService,
    private alertController: AlertController, private http: HttpClient) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.newFarmForm = this.formBuilder.group({
      userId: this.userId,
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      phonenumber: ['', Validators.maxLength(50)],
      address: ['', [Validators.minLength(1), Validators.maxLength(255)]],
      county: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      country: ['', [Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.minLength(1), Validators.maxLength(300)]]
    });
  }

  onSubmit() {
    this.registerFarm(this.newFarmForm.value).subscribe(val => {
      if (val) {
        console.log(val);
        this.router.navigateByUrl('/farm-overview/' + this.userId);
      }
    });
  }

  registerFarm(credentials) {
    return this.http.post(environment.url + '/api/farm/register', credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

}
