import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPage } from './about.component';
import { LegalSection } from '../../sections/legal/legal.component';
import { SellingPointsSection } from '../../sections/selling-points/selling-points.component';
import { HowItWorksSection } from '../../sections/how-it-works/how-it-works.component';

import { TileComponent } from '../../components/tile/tile.component';


describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AboutPage,
        HowItWorksSection,
        SellingPointsSection,
        LegalSection,
        TileComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
