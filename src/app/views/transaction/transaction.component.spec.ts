import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import {TransactionServiceGateway} from '../../core/transaction/port/transaction.service.gateway';
import {TransactionService} from '../../core/transaction/adapter/transaction.service';
import {TransactionServiceInMemory} from '../../core/transaction/adapter/transaction.service.in-memory.gateway';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

describe('TransactionsComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
