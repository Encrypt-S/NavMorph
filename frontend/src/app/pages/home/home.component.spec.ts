import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MaterializeModule } from 'angular2-materialize'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'

import { HomePage } from './home.component'

import { HowItWorksSection } from '../../sections/how-it-works/how-it-works.component'
import { LegalSection } from '../../sections/legal/legal.component'
import { PartnersSection } from '../../sections/partners/partners.component'
import { HeaderSection } from '../../sections/header/header.component'
import { FooterSection } from '../../sections/footer/footer.component'
import { SellingPointsSection } from '../../sections/selling-points/selling-points.component'
import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component'
import { HeroBannerSection } from '../../sections/hero-banner/hero-banner.component'

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api'
import { SendPageDataService } from '../../services/send-page-data/send-page-data'
import { ChangellyApiService } from '../../services/changelly-api/changelly-api'
import { OrderService } from '../../services/order/order'

import { MockChangellyService } from '../../mock-classes'

import { TileComponent } from '../../components/tile/tile.component'

describe('HomePage', () => {
  let component: HomePage
  let fixture: ComponentFixture<HomePage>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [MaterializeModule, HttpClientModule, FormsModule, RouterTestingModule],
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
        providers: [GenericNodeApiService, SendPageDataService, ChangellyApiService, OrderService],
      })
        .overrideComponent(SendCoinsFormComponent, {
          set: {
            providers: [{ provide: ChangellyApiService, useClass: MockChangellyService }],
          },
        })
        .compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
