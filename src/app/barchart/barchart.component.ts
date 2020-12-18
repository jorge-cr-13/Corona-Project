import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoronatrackService } from '../coronatrack.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

  dtDts = [];
  dtRcv = [];
  dtCss = [];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true};  
  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = true;  
  barChartData = [
    {data: this.dtDts, label: 'Daily Deaths'},
    {data: this.dtRcv, label: 'Daily Recoveries'},
    {data: this.dtCss, label: 'Daily New Cases'}
  ];
  coronita;
  country:string;
  slug:string;
  

  async ngOnInit(): Promise<void> {

    this.route.params.subscribe(params =>
      this.country = params['id'])

    if(typeof(this.country)=='undefined'){
      this.country = 'world'
    }else{
      this.route.params.subscribe(params =>
        this.country = params['id'])
    }
    if(this.country == 'world'){
      // Code if the information retrieval is the general
      this.coronita = await this.service.getDailyData();
      for(let i = 0; i< 7 ;i++){
        var last = new Date(Date.now() - ((i+1) * 24 * 60 * 60 * 1000));
        var day =(last.getDate());
        var month=last.getMonth()+1;
        this.barChartLabels.push(day.toString()+"/"+month.toString())
        this.dtDts.push(this.coronita[i]["NewDeaths"])
        this.dtRcv.push(this.coronita[i]["NewRecovered"])
        this.dtCss.push(this.coronita[i]["NewConfirmed"])
      }
      this.barChartLabels.reverse();
    }else{
      // Code for retrieving the data for a specific country
      this.slug = await this.service.getSlug(this.country)
      this.coronita = await this.service.getDailyCounData(this.slug);
      let dts:number;
      let rcv:number;
      let cnfrmd:number; 
      let dailyData: String;

      for(let i = 0; i< 7 ;i++){
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
        this.barChartLabels.push(day.toString()+"/"+month.toString())
        this.dtDts.push(dts)
        this.dtRcv.push(rcv)
        this.dtCss.push(cnfrmd)
      }
    }
  }
}
