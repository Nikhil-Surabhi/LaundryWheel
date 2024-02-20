import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule} from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import firebase from "firebase/app";
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { SchedulePickupComponent } from './schedule-pickup/schedule-pickup.component';
import { MatDialogModule } from '@angular/material/dialog';


// var firebaseConfig = {
//   apiKey: "AIzaSyAnN_zRo8t2NpCUK-4iyneQ6MlZdEVJYB4",
//   authDomain: "laundrywheel-109d7.firebaseapp.com",
//   projectId: "laundrywheel-109d7",
//   storageBucket: "laundrywheel-109d7.appspot.com",
//   messagingSenderId: "750683823598",
//   appId: "1:750683823598:web:d26b376cede6b3ed3ec2ff"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAbq4Got-4BFKLlRFDDyYGNZZOzK-6qwF8",
  authDomain: "cleverjolt-d1fec.firebaseapp.com",
  projectId: "cleverjolt-d1fec",
  storageBucket: "cleverjolt-d1fec.appspot.com",
  messagingSenderId: "883065996211",
  appId: "1:883065996211:web:cb6f7753de12c7ffacc1c6",
  measurementId: "G-0Q1YQP9X4Z"
};

AngularFireModule.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    TermsConditionsComponent,
    SchedulePickupComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireAuthModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
