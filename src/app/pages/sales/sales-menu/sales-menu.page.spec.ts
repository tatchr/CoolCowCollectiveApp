import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMenuPage } from './sales-menu.page';

describe('SalesMenuPage', () => {
  let component: SalesMenuPage;
  let fixture: ComponentFixture<SalesMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesMenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
