import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTransactionComponent } from './import-transaction.component';
import {TestUtils} from '../../../utils/test/test-utils';

describe('ImportTransactionComponent', () => {
  let component: ImportTransactionComponent;
  let fixture: ComponentFixture<ImportTransactionComponent>;

  const TARGETED_TITLES = ['Date', 'Montant', 'Type', 'Commentaire', 'Informations additionnelles'];
  const HEADER = ['Date', 'Amount', 'Comment'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('header', HEADER);
    fixture.componentRef.setInput('targets', TARGETED_TITLES);
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
    expect(targetTitles[4].innerText).toEqual('Informations additionnelles');
  });

  it('should display select input with csv headers for each target', () => {
    const selects = [...fixture.nativeElement.querySelectorAll('select.csv-header')];

    for(let i=0; i<TARGETED_TITLES.length; i++) {
      const options = [...selects[i].querySelectorAll('option')].map((option: HTMLElement) => option.innerText);
      expect(TestUtils.containsAll(options, HEADER)).toEqual([]);
    }
  })
});
