import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSectionComponent } from './demo-section.component';

describe('DemoSectionComponent', () => {
  let component: DemoSectionComponent;
  let fixture: ComponentFixture<DemoSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
