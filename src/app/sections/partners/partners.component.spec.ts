import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersSection } from './partners.component';

describe('PartnersSection', () => {
  let component: PartnersSection;
  let fixture: ComponentFixture<PartnersSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersSection ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
