import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalSectComponent } from './legal-sect.component';

describe('LegalSectComponent', () => {
  let component: LegalSectComponent;
  let fixture: ComponentFixture<LegalSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
