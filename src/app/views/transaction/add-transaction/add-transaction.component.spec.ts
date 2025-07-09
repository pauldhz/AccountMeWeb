import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionComponent } from './add-transaction.component';
import {TransactionGateway} from '../../../core/transaction/port/transaction.gateway';
import {TransactionGatewayInMemory} from '../../../core/transaction/adapter/transaction.gateway-in-memory';
import {RouterModule} from '@angular/router';

describe('AddTransactionComponent', () => {
  let component: AddTransactionComponent;
  let fixture: ComponentFixture<AddTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionComponent, RouterModule.forRoot([])],
      providers: [{provide: TransactionGateway, useFactory: () => new TransactionGatewayInMemory()}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
