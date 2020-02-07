import { TestBed } from '@angular/core/testing';

import { MilksalesService } from './milksales.service';

describe('MilksalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MilksalesService = TestBed.get(MilksalesService);
    expect(service).toBeTruthy();
  });
});
