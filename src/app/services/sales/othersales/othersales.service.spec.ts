import { TestBed } from '@angular/core/testing';

import { OthersalesService } from './othersales.service';

describe('SalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OthersalesService = TestBed.get(OthersalesService);
    expect(service).toBeTruthy();
  });
});
