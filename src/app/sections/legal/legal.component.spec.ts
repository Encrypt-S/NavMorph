import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalSection } from './legal.component';

describe('LegalSection', () => {
  let component: LegalSection;
  let fixture: ComponentFixture<LegalSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalSection ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
