import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmService } from 'src/app/services/farm/farm.service';
import { Storage } from '@ionic/storage';
import { UserDetails } from 'src/app/common/objects/UserDetails';

@Component({
  selector: 'app-register-farm',
  templateUrl: './register-farm.page.html',
  styleUrls: ['./register-farm.page.scss'],
})
export class RegisterFarmPage implements OnInit {

  protected farmForm: FormGroup;

  constructor(private farmService: FarmService, private router: Router, private storage: Storage, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.storage.get('userDetails').then((user: UserDetails) => {
      this.farmForm = this.formBuilder.group({
        userId: user.id,
        name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
        email: ['', [Validators.email, Validators.maxLength(255)]],
        phonenumber: ['', Validators.maxLength(50)],
        address: ['', [Validators.minLength(1), Validators.maxLength(255)]],
        county: ['', [Validators.minLength(1), Validators.maxLength(100)]],
        country: ['', [Validators.minLength(1), Validators.maxLength(100)]],
        description: ['', [Validators.minLength(1), Validators.maxLength(300)]]
      });
    });    
  }

  onSubmit() {
    this.farmService.registerFarm(this.farmForm).then(() => { 
      this.router.navigate(['tabs/farm-dashboard'], { replaceUrl: true }) 
    });
  }
}
