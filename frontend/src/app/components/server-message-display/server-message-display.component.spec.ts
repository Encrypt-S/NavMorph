import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerMessageDisplayComponent } from './server-message-display.component';

describe('ServerMessageDisplayComponent', () => {
  let component: ServerMessageDisplayComponent;
  let fixture: ComponentFixture<ServerMessageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerMessageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerMessageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
