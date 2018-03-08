import { TestBed, inject } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'

import { ChangellyApiService } from './changelly-api'

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api'

describe('ChangellyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ChangellyApiService, GenericNodeApiService],
    })
  })

  it(
    'should be created',
    inject([ChangellyApiService], (service: ChangellyApiService) => {
      expect(service).toBeTruthy()
    })
  )
})
