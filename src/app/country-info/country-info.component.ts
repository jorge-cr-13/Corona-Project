import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { CoronatrackService } from '../coronatrack.service';
import { Country } from '../country.model';
import { User } from '../user.model';

@Component({
  selector: 'app-country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.css']
})
export class CountryInfoComponent implements OnInit {
  

  constructor(public service: CoronatrackService,
    public route:ActivatedRoute) { 
    }

    // Initial values
    countryNm;
    coronita;
    country :Country
    disCntry: Country;
    actCs : number;
    rcvRt : string;
    mrtRt : string;
    user: User;
    privileged: boolean;


    async ngOnInit(): Promise<void> {
      this.user = this.service.getUser();
      //Check if the user is logged in and if it is, check wether is able to add news or not
      if(this.user == undefined){
        this.privileged = false;
      }else{
        this.privileged = await this.service.checkDev(this.user.email);
      }

      // Check the information about the country
      this.route.params.subscribe(params =>
      this.countryNm = params['id'])

      // Check if the country data is on the firebase
      if(await this.service.cntrFrBs(this.countryNm) == true){
        this.disCntry = this.service.getCountry(this.countryNm);
      // If the data is not on firebase check the API and set it on firebase
      }else{
        this.coronita = await this.service.getGeneralData()
        let i = 0;
        while(this.coronita['Countries'][i]['Country']!=this.countryNm){
          i++
        }
        this.country = {
        name : this.countryNm,
        newCss : this.coronita['Countries'][i]['NewConfirmed'],
        totalCss : this.coronita['Countries'][i]['TotalConfirmed'],
        newDts : this.coronita['Countries'][i]['NewDeaths'],
        totalDts : this.coronita['Countries'][i]['TotalDeaths'],
        newRcv : this.coronita['Countries'][i]['NewRecovered'],
        totalRcv : this.coronita['Countries'][i]['TotalRecovered'],
        toDate : this.service.getToday()
        }
        this.service.updateCountryData(this.country)
        await this.service.displayCnt(this.countryNm)
        this.disCntry = this.service.getCountry(this.countryNm);
      }
      //Calculate the needed values  
      this.actCs = this.disCntry.totalCss - this.disCntry.totalRcv - this.disCntry.totalDts;
      this.rcvRt = ((this.disCntry.totalRcv/this.disCntry.totalCss)*100).toFixed(2);
      this.mrtRt = ((this.disCntry.totalDts/this.disCntry.totalCss)*100).toFixed(2);
    }


  }
