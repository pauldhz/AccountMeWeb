import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTransactionComponent } from './import-transaction.component';
import {TestUtils} from '../../../utils/test/test-utils';
import {Group, GroupBuilder} from '../../../utils/mapping/group-builder';
import {of} from 'rxjs';
import {signal} from '@angular/core';
import {TransactionService} from '../../../core/transaction/adapter/transaction.service';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TransactionGateway} from '../../../core/transaction/port/transaction.gateway';
import {TransactionGatewayInMemory} from '../../../core/transaction/adapter/transaction.gateway-in-memory';

describe('ImportTransactionComponent', () => {
  let component: ImportTransactionComponent;
  let fixture: ComponentFixture<ImportTransactionComponent>;

  const CONTENT: Map<string, string[]> = new Map();
  CONTENT.set('Date', ['2025-01-01','2025-01-02','2025-01-03','2025-01-04','2025-01-05']);
  CONTENT.set('Amount', ['20.00', '21.00', '22.00', '23.00', '24.00']);
  CONTENT.set('Comment', ['Comment 1', 'Comment 2', 'Comment 3', 'Comment 4', 'Comment 5']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionComponent],
      providers: [{ provide: TransactionGateway, useFactory: () => new TransactionGatewayInMemory()}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('csvContentUploaded', CONTENT);
    fixture.componentRef.setInput('confirmation$', of('false'))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display targeted title', () => {
    const targetTitles = fixture.nativeElement.querySelectorAll('label.target-title');
    expect(targetTitles[0].innerText).toEqual('Date');
    expect(targetTitles[1].innerText).toEqual('Montant');
    expect(targetTitles[2].innerText).toEqual('Type');
    expect(targetTitles[3].innerText).toEqual('Commentaire');
    expect(targetTitles[4].innerText).toEqual('Libellé de la transaction');
  });

  it('should display select input with csv headers for each target', () => {
    const selects = [...fixture.nativeElement.querySelectorAll('select.csv-header')];

    for(let i=0; i<(fixture.componentInstance.mappingForSelectedPropositions() as Group[]).length; i++) {
      const options = [...selects[i].querySelectorAll('option')].map((option: HTMLElement) => option.innerText);
      expect(TestUtils.containsAll(options, Array.from(CONTENT.keys()))).toEqual([]);
    }
  })

  it('should display overview of content for selected header', () => {
    const select = fixture.nativeElement.querySelector('.select .csv-header');
    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const overviewRows = fixture.nativeElement.querySelector('.target-mapping .overview').querySelectorAll('span');
    expect(overviewRows.length).toEqual(4);
    expect(overviewRows[0].innerText).toEqual('20.00');
  })

  it('should switch to specified choice and loop', () => {
    const additionalFieldElement = fixture.nativeElement.querySelectorAll('.select-proposition')[1];
    expect(additionalFieldElement.innerText).toContain('Montant/Type');
    expect(additionalFieldElement.innerText).toContain('Montant signé');
    expect(additionalFieldElement.innerText).toContain('Crédit/Débit');
  })
});
