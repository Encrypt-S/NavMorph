import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule } from '@angular/http';

import { HomePage } from './home.component';

import { HowItWorksSection } from '../../sections/how-it-works/how-it-works.component';
import { LegalSection } from '../../sections/legal/legal.component';
import { PartnersSection } from '../../sections/partners/partners.component';
import { HeaderSection } from '../../sections/header/header.component';
import { FooterSection } from '../../sections/footer/footer.component';
import { SellingPointsSection } from '../../sections/selling-points/selling-points.component';
import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';
import { HeroBannerSection } from '../../sections/hero-banner/hero-banner.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';


import { TileComponent } from '../../components/tile/tile.component';


describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterializeModule,
        HttpModule,
      ],
      declarations: [
        HomePage,
        LegalSection,
        HeaderSection,
        FooterSection,
        SellingPointsSection,
        HowItWorksSection,
        HeroBannerSection,
        PartnersSection,
        TileComponent,
        SendCoinsFormComponent,
      ],
      providers: [
        GenericNodeApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
