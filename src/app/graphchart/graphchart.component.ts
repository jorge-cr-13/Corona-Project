import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { CoronatrackService } from '../coronatrack.service';

@Component({
  selector: 'app-graphchart',
  templateUrl: './graphchart.component.html',
  styleUrls: ['./graphchart.component.css']
})
export class GraphchartComponent implements OnInit {

  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

  dtDts = [];
  dtRcv = [];
  dtCss = [];
  coronita;

  lineChartData: ChartDataSets[] = [
    {data: this.dtDts, label: 'Total Deaths'},
    {data: this.dtRcv, label: 'Total Recovered'},
    {data: this.dtCss, label: 'Total Cases'}
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  slug: string;
  country:string;

  async ngOnInit(): Promise<void> {

    this.route.params.subscribe(params =>
      this.country = params['id'])

    if(typeof(this.country)=='undefined'){
      this.country = 'world'
    }else{
      this.route.params.subscribe(params =>
        this.country = params['id'])
      this.slug = await this.service.getSlug(this.country)
    }

    if(this.country == 'world'){
      // Code if the information retrieval is the general
      this.coronita = await this.service.getMonthlyData();
      let last = new Date("04/12/2020");
      for(let i = 0; i < this.amountDays(); i++){
        last = new Date(last.getTime() + 60 * 60 * 24 * 1000);
        var day =(last.getDate());
        var month=last.getMonth()+1;
        this.lineChartLabels.push(day.toString()+"/"+month.toString())
        this.dtDts.push(this.coronita[i]["TotalDeaths"])
        this.dtRcv.push(this.coronita[i]["TotalRecovered"])
        this.dtCss.push(this.coronita[i]["TotalConfirmed"])
      }
      this.dtCss.sort(function(a, b) {
        return a - b;
      })
      this.dtRcv.sort(function(a, b) {
        return a - b;
      })
      this.dtDts.sort(function(a, b) {
        return a - b;
      })
    }
    else{
      // Code for retrieving the data for a specific country
      this.slug = await this.service.getSlug(this.country)
      this.coronita = await this.service.getMntCounData(this.slug);
      let dts:number;
      let rcv:number;
      let cnfrmd:number; 
      let dailyData: String;

      for(let i = 0; i < this.coronita.length; i++){
        dailyData = this.coronita[i]["Date"];
        dts = this.coronita[i]["Deaths"];
        rcv = this.coronita[i]["Recovered"];
        cnfrmd = this.coronita[i]["Confirmed"];
        while(this.coronita[i]["Date"] == this.coronita[i+1]["Date"]){
          dts= dts + this.coronita[i+1]["Deaths"];
          rcv= rcv +this.coronita[i+1]["Recovered"];
          cnfrmd = cnfrmd+ this.coronita[i+1]["Confirmed"];
          i= i + 1;
          if(i == this.coronita.length-1){
            break;
          }
        }
        let date = (this.coronita[i]["Date"]).split("-");
        let dateMon = date[2].split("T");
        let day = dateMon[0];
        let month=date[1];
        this.lineChartLabels.push(day.toString()+"/"+month.toString())
        this.dtDts.push(dts)
        this.dtRcv.push(rcv)
        this.dtCss.push(cnfrmd)
      }
    }
  }

  // Calculate number of days between today and 4.13
  amountDays(){
    var date1 = new Date("04/13/2020"); 
    var date2 = new Date(Date.now());
  
    // To calculate the time difference of two dates 
    var Difference_In_Time = date2.getTime() - date1.getTime(); 
  
    // To calculate the no. of days between two dates 
    var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24)); 
    
    return Difference_In_Days
  }
}
