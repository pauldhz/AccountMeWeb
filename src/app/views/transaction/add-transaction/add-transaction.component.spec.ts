import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionComponent } from './add-transaction.component';
import {TransactionServiceGateway} from '../../../core/transaction/port/transaction.service.gateway';
import {TransactionServiceInMemory} from '../../../core/transaction/adapter/transaction.service.in-memory.gateway';
import {RouterModule} from '@angular/router';

describe('AddTransactionComponent', () => {
  let component: AddTransactionComponent;
  let fixture: ComponentFixture<AddTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionComponent, RouterModule.forRoot([])],
      providers: [{provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
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
