import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithTextComponent } from './image-with-text.component';

describe('ImageWithTextComponent', () => {
  let component: ImageWithTextComponent;
  let fixture: ComponentFixture<ImageWithTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageWithTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWithTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
