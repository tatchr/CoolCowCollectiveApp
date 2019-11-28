import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private httpService: HttpService) { }

  registerFeedback(form){

  }
}
