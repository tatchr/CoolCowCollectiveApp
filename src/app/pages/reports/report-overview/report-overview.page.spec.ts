import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOverviewPage } from './report-overview.page';

describe('ReportOverviewPage', () => {
  let component: ReportOverviewPage;
  let fixture: ComponentFixture<ReportOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOverviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
