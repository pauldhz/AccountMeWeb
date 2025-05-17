import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTransactionComponent } from './import-transaction.component';
import {TestUtils} from '../../../utils/test/test-utils';

describe('ImportTransactionComponent', () => {
  let component: ImportTransactionComponent;
  let fixture: ComponentFixture<ImportTransactionComponent>;

  const HEADER = ['Date', 'Amount', 'Comment'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('header', HEADER);
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

  it('should display select input with csv headers', () => {
    const selects = fixture.nativeElement.querySelectorAll('select.csv-header');
    const options = [...selects[0].querySelectorAll('option')].map((option: HTMLElement) => option.innerText);
    console.log(options);
    expect(TestUtils.containsAll(options, HEADER)).toEqual([]);

  })
});
