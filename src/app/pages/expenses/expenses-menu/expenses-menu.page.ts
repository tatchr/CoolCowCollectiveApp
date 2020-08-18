import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses-menu',
  templateUrl: './expenses-menu.page.html',
  styleUrls: ['./expenses-menu.page.scss'],
})
export class ExpensesMenuPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isOpen: boolean = false;
  automaticClose = false;
  toggleSection() {
    this.isOpen = !this.isOpen;

    // if (this.automaticClose && this.isOpen) {
    //   this.expensesService.recurringExpensesList
    //   .filter((item, itemIndex) => itemIndex != index)
    //   .map(item => item.open = false);
    // }
  }

}
