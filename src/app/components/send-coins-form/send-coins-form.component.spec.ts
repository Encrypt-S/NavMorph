import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';


import { SendCoinsFormComponent } from './send-coins-form.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ChangellyApiService } from './../../services/changelly-api/changelly-api';
import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';


const fakeData  = ['NAV', 'BTC', 'ETH', 'LTC']

class MockChangellyServ {
  getCurrencies = function(){
      return Observable.of(fakeData)
    }
  }


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
    ] ,
      providers: [
        SendCoinsFormComponent,
        ChangellyApiService,
        GenericNodeApiService,
      ],
    })

    .overrideComponent(SendCoinsFormComponent, {
      set: {
        providers: [
          { provide: ChangellyApiService, useClass: MockChangellyServ }
        ]
      }
    })

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

  it('should get the currency data', inject([SendCoinsFormComponent], ( sendCoinsSection: SendCoinsFormComponent) => {
    fakeAsync(() => {
      sendCoinsSection.getCurrencies()
      tick()
      expect(sendCoinsSection.currencies).toBe(fakeData)
    })
  }))
});
