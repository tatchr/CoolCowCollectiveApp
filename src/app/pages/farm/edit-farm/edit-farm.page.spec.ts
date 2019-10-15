import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFarmPage } from './edit-farm.page';

describe('EditFarmPage', () => {
  let component: EditFarmPage;
  let fixture: ComponentFixture<EditFarmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFarmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
