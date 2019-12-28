import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from 'src/app/services/http/httperror.service';
import { map, catchError, tap, finalize, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private httpErrorService: HttpErrorService, private overlayService: OverlayService) { }

  get(url) {
    return this.http.get(url).pipe(
      map(res => { return res; }),
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  get2(overlayMessage, url) {
    return this.overlayService.showOverlay(overlayMessage)
      .then(() => {
        return this.http.get(url).toPromise();
      })
      .catch(error => throwError(this.httpErrorService.handleError(error)))
      .finally(() => this.overlayService.dismissLoading());
  }

  post3(overlayMessage, url, body) {
    return this.overlayService.showOverlay(overlayMessage)
      .then(() => {
        return this.http.post(url, body).toPromise();
      })
      .catch(error => throwError(this.httpErrorService.handleError(error)))
      .finally(() => this.overlayService.dismissLoading());
  }

  post2(url, body, next?: (x: Object) => void, final?: () => void) {
    return this.http.post(url, body).pipe(
      tap(res => next(res)),
      catchError(error => throwError(this.httpErrorService.handleError(error))),
      finalize(() => final())
    );
  }

  post(url, body) {
    return this.http.post(url, body).pipe(
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  postWithTap(url, body, next?: (x: Object) => void) {
    return this.http.post(url, body).pipe(
      tap(res => next(res)),
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  put(url, body) {
    return this.http.put(url, body).pipe(
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }

  delete(url) {
    return this.http.delete(url).pipe(
      map(res => { return res; }),
      catchError(error => throwError(this.httpErrorService.handleError(error)))
    );
  }
}
