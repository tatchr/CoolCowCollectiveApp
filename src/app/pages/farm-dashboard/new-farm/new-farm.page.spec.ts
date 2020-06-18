import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFarmPage } from './new-farm.page';

describe('NewFarmPage', () => {
  let component: NewFarmPage;
  let fixture: ComponentFixture<NewFarmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFarmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
