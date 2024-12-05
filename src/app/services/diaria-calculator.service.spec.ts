import { TestBed } from '@angular/core/testing';

import { DiariaCalculatorService } from './diaria-calculator.service';

describe('DiariaCalculatorService', () => {
  let service: DiariaCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiariaCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
