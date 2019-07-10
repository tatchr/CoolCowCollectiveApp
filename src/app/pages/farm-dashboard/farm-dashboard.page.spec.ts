import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDashboardPage } from './farm-dashboard.page';

describe('FarmDashboardPage', () => {
  let component: FarmDashboardPage;
  let fixture: ComponentFixture<FarmDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
