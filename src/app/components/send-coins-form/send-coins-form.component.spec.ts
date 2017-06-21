import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { SendCoinsFormComponent } from './send-coins-form.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from './../../services/changelly-api/changelly-api';
import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';

import { MockChangellyService, fakeData } from '../../mock-classes';

describe('SendCoinsFormComponent', () => {
  let component: SendCoinsFormComponent;
  let fixture: ComponentFixture<SendCoinsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCoinsFormComponent ],
      imports: [
        FormsModule,
        HttpModule,
        MaterializeModule,
    ],
    providers: [
      SendCoinsFormComponent,
      GenericNodeApiService,
      SendPageDataService,
      { provide: ChangellyApiService, useClass: MockChangellyService },
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
    fixture = TestBed.createComponent(SendCoinsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get the currency data', async(inject([SendCoinsFormComponent], ( sendCoinsSection: SendCoinsFormComponent) => {
    sendCoinsSection.getCurrencies()
    expect(sendCoinsSection.currencies).toBe(fakeData)
  })))
});
