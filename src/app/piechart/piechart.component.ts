import { Component, OnInit,ViewChild } from '@angular/core';
import { CoronatrackService } from '../coronatrack.service';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})



export class PiechartComponent implements OnInit {

  //Initial values for the piechart
  public chart: BaseChartDirective;
  public pieChartLabels = ['Death Cases', 'Active Cases', 'Recovered Cases'];
  public pieChartData = [];
  public pieChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  tlCnfrmd :number;
  tlDts: number;
  tlRcv: number;
  actCs: number;
  coronita;
  country:string;
  slug:string;
  


  constructor(public service: CoronatrackService,
    public route:ActivatedRoute) { }

  async ngOnInit(): Promise<void> {

    //Check the country or general data
    this.route.params.subscribe(params =>
      this.country = params['id'])

    if(typeof(this.country)=='undefined'){
      this.country = 'world'
    }else{
      this.route.params.subscribe(params =>
        this.country = params['id'])
    }

    if(this.country != 'world'){
      // Code for retrieving the data for a specific country
      this.coronita = await this.service.getGeneralData()
      let i = 0;
      while(this.coronita['Countries'][i]['Country']!=this.country){
        i++
      }
      this.coronita = await this.service.getGeneralData();
      this.tlCnfrmd = this.coronita['Countries'][i]['TotalConfirmed'];
      this.tlDts = this.coronita['Countries'][i]['TotalDeaths'];
      this.tlRcv = this.coronita['Countries'][i]['TotalRecovered'];

    }else{
      // Code if the information retrieval is the general
      this.coronita = await this.service.getGeneralData();
      this.tlCnfrmd = this.coronita['Global']['TotalConfirmed'];
      this.tlDts = this.coronita['Global']['TotalDeaths'];
      this.tlRcv = this.coronita['Global']['TotalRecovered'];
    }
    //Setting the data needed for the graph
    this.actCs = this.tlCnfrmd - this.tlRcv - this.tlDts;
    this.pieChartData.push(this.tlDts);
    this.pieChartData.push(this.actCs);
    this.pieChartData.push(this.tlRcv);
    
  }

}
