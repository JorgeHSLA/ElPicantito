import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProducto } from './edit-producto';

describe('EditProducto', () => {
  let component: EditProducto;
  let fixture: ComponentFixture<EditProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
