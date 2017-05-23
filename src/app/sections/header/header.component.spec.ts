import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSection } from './header.component';

describe('HeaderSection', () => {
  let component: HeaderSection;
  let fixture: ComponentFixture<HeaderSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSection ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
