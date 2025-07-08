import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {TransactionGateway} from './core/transaction/port/transaction.gateway';
import {TransactionGatewayInMemory} from './core/transaction/adapter/transaction.gateway-in-memory';
import {RouterModule} from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [{ provide: TransactionGateway, useFactory: () => new TransactionGatewayInMemory()}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
