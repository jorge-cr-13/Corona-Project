import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoronatrackService } from '../coronatrack.service';
import { News } from '../news.model'

@Component({
  selector: 'app-news-add',
  templateUrl: './news-add.component.html',
  styleUrls: ['./news-add.component.css']
})
export class NewsAddComponent implements OnInit {

  country:string;
  date: any;
  title: string;
  url: string;

  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

    async ngOnInit(): Promise<void> {

      //Settings for adding news on a specific country pager or general
      this.route.params.subscribe(params =>
        this.country = params['id'])
      if(typeof(this.country)=='undefined'){
        this.country = 'world'
      }else{
        this.route.params.subscribe(params =>
          this.country = params['id'])
      }
  }

  //Function to add news with title, date and url
  addNews(){
    let news: News = {
      date: new Date(this.date),
      title: this.title,
      url: this.url
    };
    this.service.addNews(news,this.country);
    this.date = undefined;
    this.title = undefined;
    this.url = undefined;
  }
}
