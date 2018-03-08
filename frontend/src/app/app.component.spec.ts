import { TestBed, async } from '@angular/core/testing'
import { MaterializeModule } from 'angular2-materialize'

import { AppComponent } from './app.component'
import { HeaderSection } from './sections/header/header.component'
import { FooterSection } from './sections/footer/footer.component'
import { RouterTestingModule } from '@angular/router/testing'

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, MaterializeModule],
        declarations: [AppComponent, HeaderSection, FooterSection],
      }).compileComponents()
    })
  )

  it(
    'should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent)
      const app = fixture.debugElement.componentInstance
      expect(app).toBeTruthy()
    })
  )
})
