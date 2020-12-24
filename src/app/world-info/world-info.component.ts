import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoronatrackService } from '../coronatrack.service';
import { User } from '../user.model';

@Component({
  selector: 'app-world-info',
  templateUrl: './world-info.component.html',
  styleUrls: ['./world-info.component.css']
})
export class WorldInfoComponent implements OnInit {
  
  //Initial values for the general site
  nwCnfrmd :number;
  tlCnfrmd :number;
  nwDts: number;
  tlDts: number;
  nwRcv: number;
  tlRcv: number;
  actCs: number;
  rcvRt: String;
  mrtRt: String;
  coronita;
  country;
  user: User;
  privileged: boolean

  constructor(public service: CoronatrackService) { }

  async ngOnInit(): Promise<void> {

    //Retrieve data from the user if it is logged in
    this.user = this.service.getUser();
    if(this.user == undefined){
      this.privileged = false;
    }else{
      //Check wether the user has privilege rights for adding news
      this.privileged = await this.service.checkDev(this.user.email);
    }
  
    //Retrieve and make calculations on the general data
    this.coronita = await this.service.getGeneralData()
    this.nwCnfrmd = this.coronita['Global']['NewConfirmed'];
    this.tlCnfrmd = this.coronita['Global']['TotalConfirmed'];
    this.nwDts = this.coronita['Global']['NewDeaths'];
    this.tlDts = this.coronita['Global']['TotalDeaths'];
    this.nwRcv = this.coronita['Global']['NewRecovered'];
    this.tlRcv = this.coronita['Global']['TotalRecovered'];
    
    this.actCs = this.tlCnfrmd - this.tlRcv - this.tlDts;
    this.rcvRt = ((this.tlRcv/this.tlCnfrmd)*100).toFixed(2);
    this.mrtRt = ((this.tlDts/this.tlCnfrmd)*100).toFixed(2);

  }
}
