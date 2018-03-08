import { TestBed, inject } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'

import { GenericNodeApiService } from './generic-node-api'

describe('GenericNodeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [GenericNodeApiService],
    })
  })

  it(
    'should be created',
    inject([GenericNodeApiService], (service: GenericNodeApiService) => {
      expect(service).toBeTruthy()
    })
  )

  // it('should extract data from a response')
})
