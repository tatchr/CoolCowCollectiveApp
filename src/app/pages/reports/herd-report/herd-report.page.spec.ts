import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HerdReportPage } from './herd-report.page';

describe('HerdReportPage', () => {
  let component: HerdReportPage;
  let fixture: ComponentFixture<HerdReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HerdReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerdReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
