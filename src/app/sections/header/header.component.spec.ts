import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';

import { HeaderSection } from './header.component';

describe('HeaderSection', () => {
  let component: HeaderSection;
  let fixture: ComponentFixture<HeaderSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterializeModule ],
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
