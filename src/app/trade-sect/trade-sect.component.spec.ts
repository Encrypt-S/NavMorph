import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeSectComponent } from './trade-sect.component';

describe('TradeSectComponent', () => {
  let component: TradeSectComponent;
  let fixture: ComponentFixture<TradeSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
