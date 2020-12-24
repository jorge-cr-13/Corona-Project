import { Component, OnInit } from '@angular/core';
import { CoronatrackService } from '../coronatrack.service';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html',
  styleUrls: ['./country-table.component.css']
})
export class CountryTableComponent implements OnInit {

  coronita;
  coroCoun;

  //Set the columns head for the country table
  headElements = ['Country','New Cases', 'Total Cases', 'New Recoveries','Total Recoveries','New Deaths','Total Deaths'];

  //Use the Activated route and service to navigate to each country data.
  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    //Obtain the data from each country
    this.coronita = await this.service.getGeneralData()
    this.coroCoun = this.coronita["Countries"]
  }
}
