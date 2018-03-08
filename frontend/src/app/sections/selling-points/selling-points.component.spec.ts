import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SellingPointsSection } from './selling-points.component'
import { TileComponent } from '../../components/tile/tile.component'

describe('SellingPointsSection', () => {
  let component: SellingPointsSection
  let fixture: ComponentFixture<SellingPointsSection>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SellingPointsSection, TileComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingPointsSection)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
