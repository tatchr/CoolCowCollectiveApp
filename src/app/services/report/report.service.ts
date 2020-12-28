import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, finalize, timeout } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Period } from 'src/app/common/objects/Enums';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reportContent = [
    { val: 'Farm information', isChecked: true },
    { val: 'Herd information', isChecked: true },
    { val: 'Milk sales', isChecked: true },
    { val: 'Other sales', isChecked: true },
    { val: 'Expenses', isChecked: true }
  ];

  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  constructor(private httpService: HttpService, private http: HttpClient, private file: File,
    private toastController: ToastController, private fileOpener: FileOpener, public datePicker: DatepickerService) { }

  periodSelected(period) {
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);

    this.selectedToDate = result.toDate;
    this.selectedFromDate = result.fromDate;
  }

  getReport(userId, farmId, reportContent, fileType, fromDate, toDate) {
    //let url = environment.url + '/api/report/' +  userId + '/' + farmId + '/' + reportContent + '/' + fileType + '/' + fromDate + '/' + toDate;
    let url = `${environment.url}/api/report?userId=${userId}&farmId=${farmId}&reportContent=${reportContent}&fileType=${fileType}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`;

    return this.http.get(url, { responseType: 'blob' })
      .subscribe((res: Blob) => {
        this.file.writeFile(this.file.externalRootDirectory + '/Download', "test.xlsx", res, { replace: true })
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
      duration: 6000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'Open file',
          handler: () => {
            this.fileOpener.open(this.file.externalRootDirectory + '/Download/test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          }
        }
        ,
        {
          side: 'start',
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async openFromDatePicker(){
    this.selectedPeriod = '';
    this.selectedFromDate = await this.datePicker.openDatePicker(this.selectedFromDate);    
  }

  async openToDatePicker(){
    this.selectedPeriod = '';
    this.selectedToDate = await this.datePicker.openDatePicker(this.selectedToDate);
  }
}
