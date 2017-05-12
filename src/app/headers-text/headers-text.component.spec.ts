import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersTextComponent } from './headers-text.component';

describe('HeadersTextComponent', () => {
  let component: HeadersTextComponent;
  let fixture: ComponentFixture<HeadersTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadersTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
