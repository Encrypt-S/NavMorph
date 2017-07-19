import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';
import { RouterTestingModule } from '@angular/router/testing';

import { SendCoinsFormComponent } from './send-coins-form.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { SendPageDataService } from '../../services/send-page-data/send-page-data';
import { ChangellyApiService } from './../../services/changelly-api/changelly-api';
import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';
import { OrderService } from '../../services/order/order';

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
        RouterTestingModule,
    ],
    providers: [
      SendCoinsFormComponent,
      GenericNodeApiService,
      SendPageDataService,
      OrderService,
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

  it('should invalidate estimate data', (inject([SendCoinsFormComponent], (sendCoinsSection: SendCoinsFormComponent) => {
      sendCoinsSection.estimateValid = true
      sendCoinsSection.invalidateEstimate()
      expect(sendCoinsSection.estimateValid).toBe(false)
  })))

  it('should clear form data', ( inject([SendCoinsFormComponent], (sendCoinsSection: SendCoinsFormComponent) => {
    // TODO: Figure out how to test private function call to dataServ

    sendCoinsSection.currencies[0] = 'nav'
    sendCoinsSection.estimateValid = true
    sendCoinsSection.originCoin = 'doge'
    sendCoinsSection.destCoin = 'doge'

    sendCoinsSection.clearFormData()

    expect(sendCoinsSection.estimateValid).toBe(false)
    expect(sendCoinsSection.originCoin).toBe('nav')
    expect(sendCoinsSection.destCoin).toBe('nav')
  })))

  it('should storeFormData', ( inject([SendCoinsFormComponent], (sendCoinsSection: SendCoinsFormComponent) => { 
    spyOn(sendCoinsSection.dataServ, 'storeData')

    sendCoinsSection.currencies['0'] = 'cat'
    sendCoinsSection.transferAmount = 100
    sendCoinsSection.originCoin = 'doge'
    sendCoinsSection.destCoin = 'doge'
    sendCoinsSection.destAddr = 'dog house'

    sendCoinsSection.storeFormData()

    expect(sendCoinsSection.dataServ.storeData).toHaveBeenCalledWith(
      sendCoinsSection.transferAmount, sendCoinsSection.originCoin,
      sendCoinsSection.destCoin, sendCoinsSection.destAddr)
  })))

  it('should storeFormData when theres an undefined origin coin', ( inject([SendCoinsFormComponent], (sendCoinsSection: SendCoinsFormComponent) => {
    spyOn(sendCoinsSection.dataServ, 'storeData')

    sendCoinsSection.currencies['0'] = 'cat'
    sendCoinsSection.transferAmount = 100
    sendCoinsSection.originCoin = undefined
    sendCoinsSection.destCoin = 'doge'
    sendCoinsSection.destAddr = 'dog house'

    sendCoinsSection.storeFormData()

    expect(sendCoinsSection.dataServ.storeData).toHaveBeenCalledWith(
      sendCoinsSection.transferAmount, sendCoinsSection.currencies['0'],
      sendCoinsSection.destCoin, sendCoinsSection.destAddr)    
  })))

  it('should storeFormData when theres an undefined dest coin', ( inject([SendCoinsFormComponent], (sendCoinsSection: SendCoinsFormComponent) => {
    spyOn(sendCoinsSection.dataServ, 'storeData')

    sendCoinsSection.currencies['0'] = 'cat'
    sendCoinsSection.transferAmount = 100
    sendCoinsSection.originCoin = 'doge'
    sendCoinsSection.destCoin = undefined
    sendCoinsSection.destAddr = 'dog house'

    sendCoinsSection.storeFormData()

    expect(sendCoinsSection.dataServ.storeData).toHaveBeenCalledWith(
      sendCoinsSection.transferAmount, sendCoinsSection.originCoin,
      sendCoinsSection.currencies['0'], sendCoinsSection.destAddr)    
  })))

  it('toggle form state after a certain time', async(inject([SendCoinsFormComponent], ( sendCoinsSection: SendCoinsFormComponent) => {
    jasmine.clock().install()
    sendCoinsSection.isDisabled = true
    sendCoinsSection.toggleFormState()
    expect(sendCoinsSection.isDisabled).toBe(true)
    jasmine.clock().tick(101)
    expect(sendCoinsSection.isDisabled).toBe(false)
    jasmine.clock().uninstall()
  })))
});
