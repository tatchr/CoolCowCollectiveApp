import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, finalize, timeout } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpService: HttpService, private http: HttpClient, private file: File, 
    private toastController: ToastController, private fileOpener: FileOpener) { }

  getReport(userId, farmId, type, fileType, fromDate, toDate){
    let url = environment.url + '/api/report/' + userId + '/' + farmId + '/' + type + '/' + fileType + '/' + fromDate + '/' + toDate;

    return this.http.get(url, {responseType: 'blob'})
    .subscribe((res: Blob) => {
      this.file.writeFile(this.file.externalRootDirectory + '/Download', "test.xlsx", res, {replace: true})
      .then(() => {
        this.presentToastWithOptions();
      }      
      );
    })
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Report test.xlsx downloaded',
      //message: 'Open report now?' ,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'Open file',
          handler: () => {
            this.fileOpener.open(this.file.externalRootDirectory + '/Download/test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          }
        }
        //, 
        // {
        //   text: 'No',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // }
      ]
    });
    toast.present();
  }
}
