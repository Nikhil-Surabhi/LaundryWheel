import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { CommonHttpService } from '../services/common-http.service';
import "firebase/auth";
import firebase from 'firebase/app';
// import { AngularFireModule} from '@angular/fire';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  loginForm: FormGroup;
  isShowOTPfield = false;
  recaptchaVerifier: any;
  confirmationResult: any;
  firebaseUid: string;
  isDisabledSignin = false;
  isDisabledGetOtp = false;
  accessToken:string;
  user_id: number;
  constructor(
    private formBuilder: FormBuilder,
    private _commonHttpService : CommonHttpService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.formIntilizer();

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        // this.getOTP();
      }
    });
  }
  formIntilizer() {
    this.loginForm = this.formBuilder.group(
      {
        country_code: [''],
        phone_number: [''],
        otp: ['']
      }
    );
  }

  checkIfUserExists(){
    // this.isDisabledGetOtp = true;
    // setTimeout(function() {
    //   this.isDisabledGetOtp = false;
    //   console.log('after30001',this.isDisabledGetOtp );

    // }, 3000);
    var payload = {
      "email": `${this.loginForm.value.country_code}${this.loginForm.value.phone_number}`
    }
    console.log('payload:', payload);
    this.subscribeToCheckIfUserExists(this._commonHttpService.create(payload, 'mscservices/checkIfUserExists'));
  }
  protected subscribeToCheckIfUserExists(result: Observable<HttpResponse<any>>) {
    result.subscribe((res) => this.checkIfUserExistsSuccess(res.body[0]), response => this.checkIfUserExistsError(response));
  }

  protected checkIfUserExistsSuccess(response) {
    if(response.count === "1"){
      this.getOTP();
    }
    else {
      alert ("user doesnot exist, sign up instead.");

    }
  }

  protected checkIfUserExistsError(responce) {
    alert(responce.error.errorText);
  }

  getOTP(){
    firebase.auth().signInWithPhoneNumber(`${this.loginForm.value.country_code}${this.loginForm.value.phone_number}`, this.recaptchaVerifier)
    .then((confirmationResult) => {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    this.confirmationResult = confirmationResult;
    this.isShowOTPfield = true;
    }).catch(err => {
       console.log(err);

    })
  }

  signInWithFirebase() {
    // this.isDisabledSignin = true;
    // setTimeout(function() {
    //   this.isDisabledSignin = false;
    //   console.log('after3000', this.isDisabledSignin);

    // }, 3000);
    this.confirmationResult.confirm(this.loginForm.value.otp).then(user=>{
    
    this.firebaseUid = user.user.uid;
    this.resetPassword();
    })
    }
// direct login: email = id => token from node =>  

  resetPassword(){
    var payload = {
      "email": `${this.loginForm.value.country_code}${this.loginForm.value.phone_number}`,
      "newPassword": this.firebaseUid
    }

    console.log('payload:', payload);
    this.subscribeToResetPassword(this._commonHttpService.create(payload, 'mscservices/resetPassword'));
  }
  protected subscribeToResetPassword(result: Observable<HttpResponse<any>>) {
    result.subscribe((res) => this.resetPasswordSuccess(res.body[0]), response => this.resetPasswordError(response));
  }

  protected resetPasswordSuccess(response) {
    console.log('responce:', response);
    this.loginUser();
  }

  protected resetPasswordError(responce) {
    alert(responce.error.errorText);

  }

  loginUser(){
    var payload = {
      "email": `${this.loginForm.value.country_code}${this.loginForm.value.phone_number}`,
      "password":this.firebaseUid
    }

    console.log('payload:', payload);
    this.subscribeToLoginUser(this._commonHttpService.create(payload, 'Users/login'));
  }
  protected subscribeToLoginUser(result: Observable<HttpResponse<any>>) {
    result.subscribe((res) => this.loginUserSuccess(res.body), response => this.loginUserError(response));
  }

  protected loginUserSuccess(response) {
    console.log("login respon",response);
    this.accessToken = response.id;
    this.user_id = response.userId;   
    this.getUserDetails();
  }

  protected loginUserError(responce) {
    alert(responce.error.errorText);    
  }

  getUserDetails(){    
    this.subscribeToGetUserDetails(this._commonHttpService.get(`Users/${this.user_id}?access_token=${this.accessToken}`));
  }
  protected subscribeToGetUserDetails(result: Observable<HttpResponse<any>>) {
    result.subscribe((res) => this.getUserDetailsSuccess(res.body), response => this.getUserDetailsError(response));
  }

  protected getUserDetailsSuccess(response) {
   console.log('service user details',response);
   var user_details = {
    "access_token":this.accessToken,
    "user_id": this.user_id,
    "role": response.role
  }
  console.log(user_details, "user_details");

    localStorage.setItem('user_details', JSON.stringify(user_details));
    sessionStorage.setItem('user_details', JSON.stringify(user_details));
    this.router.navigateByUrl('home');
  }

  protected getUserDetailsError(responce) {
    alert(responce.error.errorText);    
  }
}
