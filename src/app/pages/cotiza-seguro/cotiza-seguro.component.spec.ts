import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizaSeguroComponent } from './cotiza-seguro.component';

describe('CotizaSeguroComponent', () => {
  let component: CotizaSeguroComponent;
  let fixture: ComponentFixture<CotizaSeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizaSeguroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizaSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
