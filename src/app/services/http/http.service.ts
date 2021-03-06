import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from 'src/app/services/http/httperror.service';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private httpErrorService: HttpErrorService, private overlayService: OverlayService) { }  

  public get(overlayMessage, url): Promise<Object> {
    if(overlayMessage == null){
      return this.getWithoutOverlay(url).toPromise();
    }

    return this.getWithOverlay(overlayMessage, url);    
  }

  private getWithoutOverlay(url): Observable<Object> {
    return this.http.get(url).pipe(
      map(res => { return res; }),
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  private getWithOverlay(overlayMessage, url){
    let id = Math.random().toString(36).substring(7);
    return this.overlayService.presentLoader(id, overlayMessage)
      .then(() => {
        return this.http.get(url).toPromise();
      })
      .catch(error => throwError(this.httpErrorService.handleError(error)))
      .finally(() => this.overlayService.dismissLoader(id));
  }

  post3(overlayMessage, url, body) {
    let id = Math.random().toString(36).substring(7);

    return this.overlayService.presentLoader(id, overlayMessage)
      .then(() => {
        return this.http.post(url, body).toPromise();
      })
      .catch(error => throwError(this.httpErrorService.handleError(error)).toPromise())
      .finally(() => this.overlayService.dismissLoader(id));
  }

  post(url, body) {
    return this.http.post(url, body, { observe: 'response' }).pipe(
      catchError(error => throwError(error))
    );
  }

  put(url, body) {
    return this.http.put(url, body, { observe: 'response' }).pipe(
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  delete(url) {
    return this.http.delete(url, { observe: 'response' }).pipe(
      map(res => { return res; }),
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }
}
