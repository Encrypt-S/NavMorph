import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesTextComponent } from './images-text.component';

describe('ImagesTextComponent', () => {
  let component: ImagesTextComponent;
  let fixture: ComponentFixture<ImagesTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
