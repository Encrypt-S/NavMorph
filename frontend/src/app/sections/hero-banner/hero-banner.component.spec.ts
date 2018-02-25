import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpClientModule, Http, BaseRequestOptions, XHRBackend } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';
import { OrderService } from '../../services/order/order';

import { MockChangellyService } from '../../mock-classes';

import { HeroBannerSection } from './hero-banner.component';

describe('heroBannerSection', () => {
  let component: HeroBannerSection;
  let fixture: ComponentFixture<HeroBannerSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeroBannerSection,
        SendCoinsFormComponent,
       ],
      imports: [
        MaterializeModule,
        HttpClientModule,
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        GenericNodeApiService,
        SendPageDataService,
        ChangellyApiService,
        OrderService,
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
    fixture = TestBed.createComponent(HeroBannerSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
