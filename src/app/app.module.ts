import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule} from 'ng2-charts';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BarchartComponent } from './barchart/barchart.component';
import { CountryInfoComponent } from './country-info/country-info.component';
import { CountryTableComponent } from './country-table/country-table.component';
import { GraphchartComponent } from './graphchart/graphchart.component';
import { NewsAddComponent } from './news-add/news-add.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { PiechartComponent } from './piechart/piechart.component';
import { WorldInfoComponent } from './world-info/world-info.component';
import { CoronatrackService} from './coronatrack.service';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    CountryInfoComponent,
    CountryTableComponent,
    GraphchartComponent,
    NewsAddComponent,
    NewsFeedComponent,
    PiechartComponent,
    WorldInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ChartsModule,
    FormsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    CoronatrackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
