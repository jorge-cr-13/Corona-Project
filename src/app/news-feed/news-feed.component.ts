import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoronatrackService } from '../coronatrack.service';
import { News } from '../news.model'

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {

   news: News[];
   country;

  constructor(public service:CoronatrackService,
    public route:ActivatedRoute) { }

    async ngOnInit(): Promise<void> {

      // Code for displaying the news on each country or general
      this.route.params.subscribe(params =>
        this.country = params['id'])
  
      if(typeof(this.country)=='undefined'){
        this.country = 'world'
      }else{
        this.route.params.subscribe(params =>
          this.country = params['id'])
      }
      //Retrieve the news data
      this.service.getNews(this.country)
    .subscribe((news: News[])=>{
      this.news = news;
    });
      
  }
}
