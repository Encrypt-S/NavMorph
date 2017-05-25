import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SendCoinsSection } from './send-coins.component';

const currencies = [{ticker: 'NAV', name: 'Nav Coin'}]

const CurrenciesService = {
  getCurrencies: () => {
    return {
      subscribe: (success, error) => {
        success(currencies)
      }
    }
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
        SendCoinsSection,
      ],
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
  }))


});
