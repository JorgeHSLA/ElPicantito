import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdicional } from './edit-adicional';

describe('EditAdicional', () => {
  let component: EditAdicional;
  let fixture: ComponentFixture<EditAdicional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdicional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdicional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
