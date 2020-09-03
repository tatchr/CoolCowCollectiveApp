import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private httpService: HttpService) { }

  registerFeedback(feedbackDetails){
    return this.httpService.post(`${environment.url}/api/feedback/register`, feedbackDetails);
  }
}
