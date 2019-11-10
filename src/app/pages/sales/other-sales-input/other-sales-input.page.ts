import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage implements OnInit {

  othersalesForm: FormGroup;
  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());
  cowsList: Array<CowDetails> = [];
  showCowList: boolean;
  showOtherInput: boolean;
  showSpermInput: boolean;
  animalTypes: Array<string> = ['Calf', 'Cow', 'Bull', 'Heifer'];
  otherItemDescription: string = "";

  constructor(private router: Router, private salesService: SalesService, private cowService: CowService, private formBuilder: FormBuilder,
    private storage: Storage, private datePicker: DatepickerService) { }

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date();
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.initiate();
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
    });

    this.initiateForm();
  }

  initiateForm() {
    this.othersalesForm = this.formBuilder.group({
      farmId: [this.farmId],
      date: [this.selectedDateString],
      itemsold: [null, [Validators.required]],
      cowidsold: [null],
      price: [null, [Validators.required, Validators.min(0.0), Validators.max(100000.00)]],
      quantity: [null, [Validators.max(100000.00)]],
      offtakername: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      offtakercompany: [null],
    });
  }

  itemSelected(event) {
    this.showOtherInput = event.detail.value == 'Other';
    this.showSpermInput = event.detail.value == 'Sperm';
    this.showCowList = this.animalTypes.includes(event.detail.value);
    if (this.showCowList) {
      this.loadCowsList(event.detail.value);
    }
  }

  loadCowsList(cowType) {
    this.cowService.getAllCowsOfType(this.farmId, cowType).subscribe(res => {
      this.cowsList = res['cows'];
      this.cowService.cowListState.next(false);
    });
  }

  round(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  onSubmit() {
    if (this.othersalesForm.valid) {
      this.othersalesForm.controls['farmId'].setValue(this.farmId);
      this.othersalesForm.controls['date'].setValue(this.selectedDateString);

      let itemsold = this.othersalesForm.controls['itemsold'].value;
      if(itemsold == 'Other'){
        this.othersalesForm.controls['itemsold'].setValue(this.otherItemDescription);
      }

      this.salesService.registerOtherSalesRecord(this.othersalesForm.value).subscribe(val => {
        if (val) {
          this.returnToOverview();
        }
      });
    }
  }

  returnToOverview() {
    this.salesService.otherSalesListState.next(true);
    this.cowService.cowListState.next(true);
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.selectedDateString = this.datePicker.formatDate(data.data.date);
      }
    });
  }
}
