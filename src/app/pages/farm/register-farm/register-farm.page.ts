import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmService } from 'src/app/services/farm/farm.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-register-farm',
  templateUrl: './register-farm.page.html',
  styleUrls: ['./register-farm.page.scss'],
})
export class RegisterFarmPage implements OnInit {

  newFarmForm: FormGroup;
  userId: string;

  constructor(private farmService: FarmService, private router: Router, private activatedRoute: ActivatedRoute, 
    private storage: Storage, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.storage.get('userId').then(userId => {
      this.newFarmForm = this.formBuilder.group({
        userId: userId,
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
    this.farmService.registerFarm(this.newFarmForm.value).subscribe(val => {
      if (val) {
        this.router.navigateByUrl('/tabs');
      }
    });
  }
}