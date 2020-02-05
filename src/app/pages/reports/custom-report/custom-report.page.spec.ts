import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportPage } from './custom-report.page';

describe('CustomReportPage', () => {
  let component: CustomReportPage;
  let fixture: ComponentFixture<CustomReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
