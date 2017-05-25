import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPage } from './demo.component';

describe('DemoPage', () => {
  let component: DemoPage;
  let fixture: ComponentFixture<DemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
