import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersSectComponent } from './partners-sect.component';

describe('PartnersSectComponent', () => {
  let component: PartnersSectComponent;
  let fixture: ComponentFixture<PartnersSectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersSectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersSectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
