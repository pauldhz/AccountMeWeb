import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransactionComponent } from './edit-transaction.component';
import {RouterModule} from '@angular/router';
import {TransactionServiceGateway} from '../../../core/transaction/port/transaction.service.gateway';
import {TransactionServiceInMemory} from '../../../core/transaction/adapter/transaction.service.in-memory.gateway';
import {of} from 'rxjs';
import {input, InputSignal} from '@angular/core';
import {Transaction} from '../../../core/transaction/model/transaction-model';
describe('EditTransactionComponent', () => {
  let component: EditTransactionComponent;
  let fixture: ComponentFixture<EditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransactionComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTransactionComponent);
    fixture.componentInstance.editConfirmation$ = of();
    fixture.componentRef.setInput('transaction', undefined);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
