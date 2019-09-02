import { TestBed } from '@angular/core/testing';

import { MilkService } from './milk.service';

describe('MilkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MilkService = TestBed.get(MilkService);
    expect(service).toBeTruthy();
  });
});
