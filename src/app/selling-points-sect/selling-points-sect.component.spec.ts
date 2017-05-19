import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingPointsSectComponent } from './selling-points-sect.component';

describe('SellingPointsSectComponent', () => {
  let component: SellingPointsSectComponent;
  let fixture: ComponentFixture<SellingPointsSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingPointsSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingPointsSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
