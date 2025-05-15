import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {TransactionServiceGateway} from './core/transaction/port/transaction.service.gateway';
import {TransactionServiceInMemory} from './core/transaction/adapter/transaction.service.in-memory.gateway';
import {RouterModule} from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionServiceGateway, useFactory: () => new TransactionServiceInMemory()}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
