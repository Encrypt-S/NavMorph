import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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

class mockCurrServ extends CurrenciesService{
  getCurrencies(): Observable<Object[]> {
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
          { provide: CurrenciesService, useClass: mockCurrServ }
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

  it('should get the currency data', inject([SendCoinsSection], (sendCoinsSection: SendCoinsSection) => {
    //@TODO Mock the CurrenciesProvider
    //@TODO Test the data is set into this.currencies
      sendCoinsSection.getCurrencies()
      expect(sendCoinsSection.currencies).toBe(fakeData)
  }))


});
