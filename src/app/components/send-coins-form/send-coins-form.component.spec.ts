import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SendCoinsFormComponent } from './send-coins-form.component';
import { CurrenciesService } from './../../services/currencies/currencies';
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


describe('SendCoinsFormComponent', () => {
  let component: SendCoinsFormComponent;
  let fixture: ComponentFixture<SendCoinsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCoinsFormComponent ],
      imports: [FormsModule, HttpModule],
      providers: [
        SendCoinsFormComponent, CurrenciesService
      ],
    })

    .overrideComponent(SendCoinsFormComponent, {
      set: {
        providers: [
          { provide: CurrenciesService, useClass: MockCurrServ }
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
