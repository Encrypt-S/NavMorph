import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSectComponent } from './demo-sect.component';

describe('DemoSectComponent', () => {
  let component: DemoSectComponent;
  let fixture: ComponentFixture<DemoSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
