import { TestBed, inject } from '@angular/core/testing'

import { TitleChangeService } from './title-change'
import { Title } from '@angular/platform-browser'

describe('TitleChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleChangeService, Title],
    })
  })

  it(
    'should be created',
    inject([TitleChangeService], titleChangeService => {
      expect(titleChangeService).toBeTruthy()
    })
  )
})
