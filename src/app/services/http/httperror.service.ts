import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorService {

  constructor(private router: Router, private alertService: AlertService) { }

  handleError(err: any) {
    switch(err.status){
      case 422:
        this.unprocessableEntity422Alert(err.error.errMessage);
        break;
      case 400:
        this.badRequest400Alert(err.error.errMessage);
        break;
      case 401:
        this.unauthorized401Alert();
        this.router.navigateByUrl('/login');
        break;
      case 500:
        this.internalServerError500Alert(err.error.errMessage);
        break;
      case 0:
        this.cantConnectToServerAlert();
        break;
      default: 
        this.unknownErrorAlert(err);        
    }
    console.log(err);
    console.log(err.status);
  };

  unprocessableEntity422Alert(message){
    this.alertService.showAlert1('', message, ['OKAY']);    
  }

  badRequest400Alert(message){
    this.alertService.showAlert1('Bad request', message, ['OKAY']);
  }

  unauthorized401Alert(){
    this.alertService.showAlert1('Unauthorized', 'Please log in to your Cool Cow Collective account.', ['OKAY']);
  }

  internalServerError500Alert(message){
    this.alertService.showAlert1('Internal server error', message, ['OKAY']);
  }

  cantConnectToServerAlert(){
    this.alertService.showAlert1('Error connecting to server', 'Could not reach server, please try again later.', ['OKAY']);
  }

  unknownErrorAlert(err){
    this.alertService.showAlert1('Unknown error', 'Error status code: ' + err.status + ' ' + err.message, ['OKAY']);
  }
}
