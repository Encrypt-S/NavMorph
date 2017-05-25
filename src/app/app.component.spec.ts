import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { HeaderSection} from "./sections/header/header.component";
import { FooterSection} from "./sections/footer/footer.component";
import { RouterModule } from '@angular/router';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, HeaderSection, FooterSection
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
