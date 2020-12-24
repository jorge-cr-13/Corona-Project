import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Country } from './country.model';
import { User } from './user.model';
import firebase from 'firebase';
import { News } from './news.model';
import { ResourceLoader } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CoronatrackService {

   // Main table Url
   urlSummary = "https://api.covid19api.com/summary";
   // Countries data for the main page
   countrSummary = "https://api.covid19api.com/countries"
   // Bar and line graph url and variables
   urlDaily: string;
   dayT;monT;yeaT;
   day7;
   mon7;yea7;day_7;
 
   // User login 
   user: User
 
   constructor(private afAuth: AngularFireAuth, private http:HttpClient,
     private router: Router, private firestore : AngularFirestore) { }
   
   // Summary table retrieval function
   async getGeneralData(){
     let coroGen;
     await this.http.get(this.urlSummary).toPromise().then(data =>
       coroGen = data)
     return coroGen;
   }
 
     // Bar graph information retrieval function
     async getDailyData(){
       let coroDai;
       await this.http.get(this.generateDailyUrl()).toPromise().then(data =>
         coroDai = data);
       return coroDai
     }
     // Bar and line graph information for countries retrieval function
     async getDailyCounData(slug:string){
       let coroDai;
       await this.http.get(this.generateDailyUrlCntr(slug)).toPromise().then(data =>
         coroDai = data);
       return coroDai
     }
 
    // Line graph information retrieval function
 
   async getMonthlyData(){
     let coroMon;
     await this.http.get(this.generateMonthlyUrl()).toPromise().then(data =>
       coroMon = data);
     return coroMon;
   }
 
 
   // Function to calculate 7th day before today
   generate7Day(){
     let last = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
     let day =(last.getDate());
     let month=last.getMonth()+1;
     if (month>12){
       month = 1;
     }
     let year=last.getFullYear();
     this.day_7 = [day,month,year]
     return this.day_7 
   }
 
   // Today's date as the API format
   getToday(){
     let today = new Date(Date.now());
     let yeaT;
     let monT;
     let dayT;
 
     dayT = today.getDate();
     if(dayT < 10){
       dayT = ("0"+dayT).toString()
     }
     monT = today.getMonth()+1;
     if(monT < 10){
       monT = ("0"+monT).toString()
     }
     else if(monT == 13){
       monT = "01"
     }
     yeaT = today.getFullYear();
     return yeaT+"-"+monT+"-"+dayT;
   }
 
   // Url creator for World API information, bar graph
   generateDailyUrl(){
     
     this.day7 = this.generate7Day()[0];
     if(this.day7 < 10){
       this.day7 = ("0"+this.day7).toString()
     }
     this.mon7 = this.generate7Day()[1];
     if(this.mon7 < 10){
       this.mon7 = ("0"+this.mon7).toString()
     }
     this.yea7 = this.generate7Day()[2];
 
     this.urlDaily = "https://api.covid19api.com/world?from="+this.yea7+"-"+this.mon7+"-"+this.day7+"T00:00:00Z&to="
     +this.getToday()+"T00:00:00Z";
     return this.urlDaily
   }
   
   // Url creator for graphchart generation, world information
   generateMonthlyUrl(){
     this.day7 = this.generate7Day()[0];
     if(this.day7 < 10){
       this.day7 = ("0"+this.day7).toString()
     }
     this.mon7 = this.generate7Day()[1];
     if(this.mon7 < 10){
       this.mon7 = ("0"+this.mon7).toString()
     }
     this.yea7 = this.generate7Day()[2];
     this.urlDaily = "https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to="
     +this.getToday()+"T00:00:00Z";
     return this.urlDaily
   }
 
   // GO to the country specific pager
   goCountry(id:string){
     this.router.navigate(['country',id])
   }
 
   // Get the slug out from the country API, to be used on the code
   async getSlug(country:string){
     let coroCoun;
     await this.http.get(this.countrSummary).toPromise().then(data =>{
       coroCoun = data;
     })
     let slugFound = false;
     let i = 0;
     while(slugFound == false){
       if(coroCoun[i]['Country'] == country){
         slugFound = true;
       }else{
         i++
       }
     }
     return coroCoun[i]['Slug']
   }
 
  //Url creator for Country Daily Data information, bar and line graph
 generateDailyUrlCntr(slug:string){

  this.urlDaily = "https://api.covid19api.com/total/country/"+slug
  return this.urlDaily
}
 
 // Url creator for Country 1st day case retrieval
 generateFrstUrlCntr(slug:string){
   this.urlDaily = "https://api.covid19api.com/dayone/country/"+slug+"/status/confirmed/live"
   return this.urlDaily
 }
 
 // First day of case positive in each country 
 async cntrFrsCs(slug:string){
   let coroMon;
   await this.http.get(this.generateFrstUrlCntr(slug)).toPromise().then(data =>
       coroMon = data);
   let dateFst = coroMon[0]['Date']
   return dateFst;
 }
 
 
 // Update or add the country data into the firebase 
 updateCountryData(updCntr:Country){
   this.firestore.collection("Country").doc(updCntr.name).set({
     name : updCntr.name,
     totalCss : updCntr.totalCss,
     newCss : updCntr.newCss,
     totalRcv: updCntr.totalRcv,
     newRcv : updCntr.newRcv,
     totalDts : updCntr.totalDts,
     newDts : updCntr.newDts,
     toDate : updCntr.toDate
   }, { merge: true});
 }
 
 // Checks wether the country is in the firebase with updated info or not
 async cntrFrBs(cntrNm:string){
   let today = this.getToday();
   let old: string;
   await this.firestore.collection("Country").doc(cntrNm).get().toPromise().then((doc) => {
     if (doc.exists) {
       old = doc.data()["toDate"];
     } else {
       return false;
     }
   });
   if(today.localeCompare(old)==0){
     return true
   }
   return false
   }
   // Retrieve the data from firebase and post in on the local storage
   async displayCnt(cntrNm:string){
     let updCountry;
     let name, toDate;
     let totalCss, newCss, newRcv, totalDts,newDts, totalRcv;
     await this.firestore.collection("Country").doc(cntrNm).get().toPromise().then((doc) => {
       name = doc.data()["name"];
       totalCss = doc.data()["totalCss"];
       newCss = doc.data()["newCss"]
       totalRcv = doc.data()["totalRcv"]
       newRcv = doc.data()["newRcv"]
       totalDts = doc.data()["totalDts"]
       newDts = doc.data()["newDts"]
       toDate = doc.data()["toDate"]
       })
       updCountry = {
         name : name,
         newCss : newCss,
         totalCss : totalCss,
         newDts : newDts,
         totalDts : totalDts,
         newRcv : newRcv,
         totalRcv : totalRcv,
         toDate : toDate
         }
       localStorage.setItem(cntrNm, JSON.stringify(updCountry));
 
     }
     // Retrieve the data from the local storage
     getCountry(cntrNm:string){
       let Country;
       Country = JSON.parse(localStorage.getItem(cntrNm));
       return Country;
     }
 
     // User sign in details
     async signInWithGoogle(){
       const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); 
       this.user = {
           uid: credientals.user.uid,
           displayName: credientals.user.displayName,
           email: credientals.user.email,
           
     };
     localStorage.setItem("user", JSON.stringify(this.user));
     this.updateUserData();
     location.reload()
   }
 
   private updateUserData(){
     this.firestore.collection("users").doc(this.user.uid).set({
       uid: this.user.uid,
       displayName: this.user.displayName,
       email: this.user.email,
     }, { merge: true});
   }
 // Checks wether the user is a developer that can add news or not
   async checkDev(devEmail:string){
     let docExist : boolean;
     await this.firestore.collection("Developers").doc(devEmail).get().toPromise().then((doc) => {
       if (doc.exists) {
         docExist = true;
       } else {
         docExist = false;
       }})
       return docExist;
   }
   // Gets the information of the user if it is signed in
   getUser(){
     if(this.user == null && this.userSignedIn()){
       this.user = JSON.parse(localStorage.getItem("user"));
     }
     return this.user;
   }
 
   userSignedIn(): boolean{
     return JSON.parse(localStorage.getItem("user")) != null;
   }
   // Signs out an user
   signOut(){
     this.afAuth.signOut();
     localStorage.removeItem("user");
     this.user = null;
     this.router.navigate(["signin"]);
     location.reload()
   }
 
   // Add the news to the feed
   addNews(news: News,cntryNm: string){
     this.firestore.collection("News").doc(cntryNm)
     .collection("news").add(news);
   }
 // Retrieves the news from the firestore collection
   getNews(cntryNm: string){
     return this.firestore.collection("News")
     .doc(cntryNm).collection("news", ref => ref.orderBy('date', 'asc')).valueChanges();
   }
}
