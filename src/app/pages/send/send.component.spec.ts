import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { HttpModule } from '@angular/http';


import { SendPage } from './send.component';

import { SendCoinsFormComponent } from '../../components/send-coins-form/send-coins-form.component';

import { GenericNodeApiService } from './../../services/generic-node-api/generic-node-api';


describe('SendPage', () => {
  let component: SendPage;
  let fixture: ComponentFixture<SendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        MaterializeModule,
        HttpModule

      ],
      declarations: [
        SendPage,
        SendCoinsFormComponent,
      ],
      providers: [
        GenericNodeApiService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
