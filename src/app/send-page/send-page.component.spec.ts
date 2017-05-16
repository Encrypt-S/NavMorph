import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPageComponent } from './send-page.component';

describe('SendPageComponent', () => {
  let component: SendPageComponent;
  let fixture: ComponentFixture<SendPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
