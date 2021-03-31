import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
import {ChartsModule} from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FixtureStatComponent } from './component/fixture-stat/fixture-stat.component';
import { GraphQLModule } from './graphql.module';
import {Router, RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FixtureStatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,

    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule,
    GraphQLModule,
    RouterModule.forRoot([
      { path: '*', component: AppComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
