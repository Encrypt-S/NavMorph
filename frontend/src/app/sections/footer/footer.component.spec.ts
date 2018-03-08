import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FooterSection } from './footer.component'

describe('FooterSection', () => {
  let component: FooterSection
  let fixture: ComponentFixture<FooterSection>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FooterSection],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSection)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
