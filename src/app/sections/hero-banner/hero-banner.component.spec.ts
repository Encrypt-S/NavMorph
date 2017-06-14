import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormsModule } from '@angular/forms';


import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';
import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from '../../services/changelly-api/changelly-api';

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
        HttpModule,
        FormsModule,
      ],
      providers: [
        GenericNodeApiService,
        SendPageDataService,
        ChangellyApiService,
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
