import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.page.html',
  styleUrls: ['./expenses-overview.page.scss'],
})
export class ExpensesOverviewPage implements OnInit {

  farmId: string;
  fromDatePickerObj: any;
  toDatePickerObj: any;
  selectedFromDateString: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDateString: string = this.datePicker.formatDate(new Date());
  expensesList: Array<ExpensesDetails> = [];
  period: string = 'lastweek';

  constructor(private expensesService: ExpensesService, private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.fromDatePickerObj = this.datePicker.getDatepickerObj(this.selectedFromDateString, fromDate, toDate);
    this.toDatePickerObj = this.datePicker.getDatepickerObj(this.selectedToDateString, fromDate, toDate);

    this.expensesService.expensesListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.loadExpensesList();
      }
    });

    this.initiate();
  }
  

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadExpensesList();
    });    
  }

  loadExpensesList(){
    this.expensesService.getExpensesRecords(this.farmId, this.selectedFromDateString, this.selectedToDateString).subscribe(res => {
      this.expensesList = res['expensesDetails'];
      this.expensesList.forEach(item => {
        item.date = this.datePicker.formatDateYYYYMMMDD(item.date);        
      });
    });
  }

  periodSelected(period){
    this.period = period;
    this.selectedToDateString = this.datePicker.formatDate(new Date());
    if(this.period == 'lastweek'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 7, 'days');
    }
    if(this.period == 'last2weeks'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 14, 'days');
    }
    if(this.period == 'lastmonth'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 1, 'months');
    }
    if(this.period == 'lastquarter'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 3, 'months');
    }
    if(this.period == 'lastyear'){
      this.selectedFromDateString = this.datePicker.subtract(new Date(), 1, 'years');
    }
    this.loadExpensesList();  
  }

  async openFromDatePicker() {
    this.fromDatePickerObj.inputDate = this.selectedFromDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.fromDatePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.period = '';
        this.selectedFromDateString = this.datePicker.formatDate(data.data.date);
        this.loadExpensesList();
      }
    });
  }

  async openToDatePicker() {
    this.toDatePickerObj.inputDate = this.selectedToDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.toDatePickerObj);
    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.period = '';
        this.selectedToDateString = this.datePicker.formatDate(data.data.date);
        this.loadExpensesList();
      }
    });
  }

}
