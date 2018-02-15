import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSocketInterfaceComponent } from './test-socket-interface.component';

describe('TestSocketInterfaceComponent', () => {
  let component: TestSocketInterfaceComponent;
  let fixture: ComponentFixture<TestSocketInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSocketInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSocketInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
