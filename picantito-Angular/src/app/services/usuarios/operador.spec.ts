import { TestBed } from '@angular/core/testing';

import { Operador } from './operador';

describe('Operador', () => {
  let service: Operador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Operador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
