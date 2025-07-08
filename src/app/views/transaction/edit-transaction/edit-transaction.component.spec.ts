import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransactionComponent } from './edit-transaction.component';
import {RouterModule} from '@angular/router';
import {TransactionGateway} from '../../../core/transaction/port/transaction.gateway';
import {TransactionGatewayInMemory} from '../../../core/transaction/adapter/transaction.gateway-in-memory';
import {of} from 'rxjs';

describe('EditTransactionComponent', () => {
  let component: EditTransactionComponent;
  let fixture: ComponentFixture<EditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransactionComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionGateway, useFactory: () => new TransactionGatewayInMemory()}]
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
