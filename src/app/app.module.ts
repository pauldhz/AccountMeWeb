import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionsModule} from './core/transactions/transactions.module';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faCoffee, faUser} from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    TransactionsModule,
    FontAwesomeModule
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faUser);
  }
}
