import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule } from '@angular/http';

import { LegalSection } from '../../sections/legal/legal.component';
import { HeaderSection } from '../../sections/header/header.component';
import { FooterSection } from '../../sections/footer/footer.component';
import { SellingPointsSection } from '../../sections/selling-points/selling-points.component';
import { HeroBannerSection } from '../../sections/hero-banner/hero-banner.component';
import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';

import { TileComponent } from '../../components/tile/tile.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { MockChangellyService } from '../../mock-classes';


import { DemoPage } from './demo.component';

describe('DemoPage', () => {
  let component: DemoPage;
  let fixture: ComponentFixture<DemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MaterializeModule, HttpModule],
      declarations: [
        LegalSection,
        HeaderSection,
        FooterSection,
        SellingPointsSection,
        HeroBannerSection,
        SendCoinsFormComponent,
        TileComponent,
        DemoPage,
      ],
      providers: [
        GenericNodeApiService,
        SendPageDataService,
        ChangellyApiService,
      ]
    })

    .overrideComponent(SendCoinsFormComponent, {
    set: {
      providers: [
        { provide: ChangellyApiService, useClass: MockChangellyService },
      ]
    }})

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
