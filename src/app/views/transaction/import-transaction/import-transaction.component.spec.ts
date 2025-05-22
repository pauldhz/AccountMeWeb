import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTransactionComponent } from './import-transaction.component';
import {TestUtils} from '../../../utils/test/test-utils';

describe('ImportTransactionComponent', () => {
  let component: ImportTransactionComponent;
  let fixture: ComponentFixture<ImportTransactionComponent>;

  const TARGETED_TITLES = ['Date', 'Montant', 'Type', 'Commentaire', 'Informations additionnelles'];

  const CONTENT: Map<string, string[]> = new Map();
  CONTENT.set('Date', ['2025-01-01','2025-01-02','2025-01-03','2025-01-04','2025-01-05']);
  CONTENT.set('Amount', ['20.00', '21.00', '22.00', '23.00', '24.00']);
  CONTENT.set('Comment', ['Comment 1', 'Comment 2', 'Comment 3', 'Comment 4', 'Comment 5']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('targets', TARGETED_TITLES);
    fixture.componentRef.setInput('csvContent', CONTENT);
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
      expect(TestUtils.containsAll(options, Array.from(CONTENT.keys()))).toEqual([]);
    }
  })

  it('should display overview of content for selected header', () => {
    const select = fixture.nativeElement.querySelector('.select .csv-header');
    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const overviewRows = fixture.nativeElement.querySelector('.select div.overview').querySelectorAll('span');
    expect(overviewRows.length).toEqual(4);
    expect(overviewRows[0].innerText).toEqual('20.00');
  })
});
