import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SendCoinsSection } from './send-coins.component';
import { CurrenciesService } from './../../services/currencies';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


const fakeData  = [
    { ticker: 'NAV', name: 'Nav Coin' },
    { ticker: 'BTC', name: 'Bitcoin' },
    { ticker: 'ETH', name: 'Ethereum' },
    { ticker: 'LTC', name: 'Litecoin' }
]

class MockCurrServ {
  getCurrencies = function(){
      return Observable.of(fakeData)
    }
  }


describe('SendCoinsSection', () => {
  let component: SendCoinsSection;
  let fixture: ComponentFixture<SendCoinsSection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCoinsSection ],
      imports: [FormsModule, HttpModule],
      providers: [
        SendCoinsSection, CurrenciesService
      ],
    })

    .overrideComponent(SendCoinsSection, {
      set: {
        providers: [
          { provide: CurrenciesService, useClass: MockCurrServ }
        ]
      }
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCoinsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get the currency data', inject([SendCoinsSection], ( sendCoinsSection: SendCoinsSection) => {
    fakeAsync(() => {
      sendCoinsSection.getCurrencies()
      tick()
      expect(sendCoinsSection.currencies).toBe(fakeData)
    })
  }))
});
