import { TestBed } from '@angular/core/testing';

import { Domiciliario } from './domiciliario.service';

describe('Domiciliario', () => {
  let service: Domiciliario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Domiciliario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
