import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'

import { SendPageDataService } from '../../services/send-page-data/send-page-data'
import { ChangellyApiService } from '../../services/changelly-api/changelly-api'
import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api'

import { StatusComponent } from './status.component'

describe('StatusComponent', () => {
  let component: StatusComponent
  let fixture: ComponentFixture<StatusComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [StatusComponent],
        providers: [SendPageDataService, ChangellyApiService, GenericNodeApiService],
        imports: [HttpClientModule],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
