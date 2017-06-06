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
        GenericNodeApiService
      ]
    })
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
