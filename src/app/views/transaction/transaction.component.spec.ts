import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponent } from './transaction.component';
import {TransactionGateway} from '../../core/transaction/port/transaction.gateway';
import {TransactionGatewayInMemory} from '../../core/transaction/adapter/transaction.gateway-in-memory';
import {RouterModule} from '@angular/router';

describe('TransactionsComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transactionGatewayInMemory: TransactionGatewayInMemory;

  beforeEach(async () => {
    transactionGatewayInMemory = new TransactionGatewayInMemory();
    await TestBed.configureTestingModule({
      imports: [TransactionComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionGateway, useFactory: () => transactionGatewayInMemory}]
    })
    .compileComponents();

  });

  it('should create', () => {
    fixture = TestBed.createComponent(TransactionComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should next page link be active when next page available', () => {
    transactionGatewayInMemory = new TransactionGatewayInMemory().withLinks(
      { first: "", next: "/transactions?page=1&size=20", last: "", prev: "" });
    fixture = TestBed.createComponent(TransactionComponent);
    fixture.detectChanges();
    const spy = spyOn(fixture.componentInstance.reload$$, 'next');

    const nextElement = fixture.nativeElement.querySelector('.next-link');

    nextElement.click();

    expect(spy).toHaveBeenCalledOnceWith('/transactions?page=1&size=20');
  });

  it('should disable next link when no next page', () => {
    transactionGatewayInMemory = new TransactionGatewayInMemory().withLinks(
      { first: "", next: "", last: "", prev: "" });
    fixture = TestBed.createComponent(TransactionComponent);
    fixture.detectChanges();
    const spy = spyOn(fixture.componentInstance.reload$$, 'next');

    const nextElement = fixture.nativeElement.querySelector('.next-link');
    nextElement.click();

    fixture.detectChanges();

    expect(nextElement.tagName.toLowerCase()).toEqual("div");
    expect(spy).not.toHaveBeenCalled();
  });

  it('should prev page link be active when prev page available', () => {
    transactionGatewayInMemory = new TransactionGatewayInMemory().withLinks(
      { first: "", next: "", last: "", prev: "/transactions?page=1&size=20" });
    fixture = TestBed.createComponent(TransactionComponent);
    fixture.detectChanges();
    const spy = spyOn(fixture.componentInstance.reload$$, 'next');

    const nextElement = fixture.nativeElement.querySelector('.prev-link');

    nextElement.click();

    expect(spy).toHaveBeenCalledOnceWith('/transactions?page=1&size=20');
  });

  it('should disable prev link when no prev page', () => {
    transactionGatewayInMemory = new TransactionGatewayInMemory().withLinks(
      { first: "", next: "", last: "", prev: "" });
    fixture = TestBed.createComponent(TransactionComponent);
    fixture.detectChanges();
    const spy = spyOn(fixture.componentInstance.reload$$, 'next');

    const nextElement = fixture.nativeElement.querySelector('.prev-link');
    nextElement.click();

    fixture.detectChanges();

    expect(nextElement.tagName.toLowerCase()).toEqual("div");
    expect(spy).not.toHaveBeenCalled();
  });
});


