import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsSectComponent } from './buttons-sect.component';

describe('ButtonsSectComponent', () => {
  let component: ButtonsSectComponent;
  let fixture: ComponentFixture<ButtonsSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
