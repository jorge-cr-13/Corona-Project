import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryInfoComponent } from './country-info/country-info.component';
import { WorldInfoComponent } from './world-info/world-info.component';

const routes: Routes = [

  //Different routes to navigate through the page
  { path: 'world', component:WorldInfoComponent},
  { path: 'country/:id', component:CountryInfoComponent},
  { path: "", pathMatch: "full", redirectTo: "world"},
  { path: "**", redirectTo: "world"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
