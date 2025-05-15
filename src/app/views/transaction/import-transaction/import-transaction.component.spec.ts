import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransactionComponent } from './import-transaction.component';

describe('ImportTransactionComponent', () => {
  let component: ImportTransactionComponent;
  let fixture: ComponentFixture<ImportTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
