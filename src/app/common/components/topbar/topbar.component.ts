import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {

  @Input() title: string;
  @Input() backbtn: boolean;
  @Input() accountBtn: boolean = true;

  constructor() { }

  ngOnInit() {}
}
