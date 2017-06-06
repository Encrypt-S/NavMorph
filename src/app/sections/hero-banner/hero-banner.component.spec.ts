import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';


import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';

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
        HttpModule
      ],
      providers: [
        GenericNodeApiService
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
