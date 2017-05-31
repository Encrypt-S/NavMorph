import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { HeroBannerSection } from './hero-banner.component';

describe('heroBannerSection', () => {
  let component: HeroBannerSection;
  let fixture: ComponentFixture<HeroBannerSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroBannerSection ],
      imports: [],
      providers: [
        HeroBannerSection
      ],
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroBannerSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
