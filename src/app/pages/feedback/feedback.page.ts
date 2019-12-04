import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  userId: number;
  category: string = 'suggestion';
  appRating: number = null;
  feedbackForm: FormGroup;

  constructor(private feedbackService: FeedbackService, private router: Router, private formBuilder: FormBuilder, 
    private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
    this.storage.get('userId').then(userId => {
      this.userId = userId;
      this.initiateForm();
    });
  }

  categorySelected(category) {
    this.category = category;
  }

  logRatingChange(rating) {
    this.appRating = rating;
  }

  initiateForm() {
    this.feedbackForm = this.formBuilder.group({
      userId: [this.userId],
      appRating: [this.appRating, [Validators.required]],
      category: [this.category],      
      feedbackText: [null, [Validators.required,  Validators.maxLength(5000)]]
    });
  }

  onSubmit(){
    if (this.feedbackForm.valid) {
      this.feedbackForm.controls['category'].setValue(this.category);
      
      this.feedbackService.registerFeedback(this.feedbackForm.value).subscribe(val => {
        if (val) {
          this.toast('Thank you for your feedback!');
          this.returnToOverview();
        }
      });
    }
  }

  returnToOverview() {
    this.router.navigateByUrl('/tabs/menu');
  }

  toast(message){
    let toast = this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: true,
      color: 'medium'
    });
    toast.then(toast => toast.present());
  }
}
