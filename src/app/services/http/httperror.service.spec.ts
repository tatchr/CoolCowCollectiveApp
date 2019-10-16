import { TestBed } from '@angular/core/testing';

import { HttpErrorService } from './httperror.service';

describe('HttpErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpErrorService = TestBed.get(HttpErrorService);
    expect(service).toBeTruthy();
  });
});
