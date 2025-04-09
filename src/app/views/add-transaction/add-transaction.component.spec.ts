import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionComponent } from './add-transaction.component';
import {TransactionServiceGateway} from '../../shared/domain/transaction/port/transaction.service.gateway';
import {
  TransactionServiceInMemory
} from '../../shared/domain/transaction/adapter/transaction.service.in-memory.gateway';

describe('AddTransactionComponent', () => {
  let component: AddTransactionComponent;
  let fixture: ComponentFixture<AddTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionComponent],
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

  it('should contain transactions', () => {
    expect(fixture.nativeElement.querySelectorAll('.transaction').length).toEqual(3);
  })
});
