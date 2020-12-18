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

  headElements = ['Country','New Cases', 'Total Cases', 'New Recoveries','Total Recoveries','New Deaths','Total Deaths'];

  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.coronita = await this.service.getGeneralData()
    this.coroCoun = this.coronita["Countries"]
    console.log(this.coroCoun)
  }
}
