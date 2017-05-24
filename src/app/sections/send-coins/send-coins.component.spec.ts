import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCoinsComponent } from './send-coins.component';

describe('SendCoinsComponent', () => {
  let component: SendCoinsComponent;
  let fixture: ComponentFixture<SendCoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
