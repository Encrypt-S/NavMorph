import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { HowItWorksSection } from './how-it-works.component'

describe('HowItWorksSection', () => {
  let component: HowItWorksSection
  let fixture: ComponentFixture<HowItWorksSection>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [HowItWorksSection],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksSection)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
