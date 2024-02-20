import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonHttpService } from '../services/common-http.service';
import {Router} from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import "firebase/auth";
import firebase from 'firebase/app';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    focus2;
    registerForm: FormGroup;
    isShowOTPfield = false;
    confirmationResult: any;
    recaptchaVerifier: any;
    firebaseUid: string;
    accessToken:string;
    user_id:number;

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
        this.registerForm = this.formBuilder.group(
          {
            first_name: [''],
            last_name: [''],
            phone_number: [''],
            referral_code:[''],
            country_code: [''],
            otp: ['']
          }
        );
      }

      checkIfUserExists(){        
        var payload = {
          "email": `${this.registerForm.value.country_code}${this.registerForm.value.phone_number}`
        }
        console.log('payload:', payload);
        this.subscribeToCheckIfUserExists(this._commonHttpService.create(payload, 'mscservices/checkIfUserExists'));
      }
      protected subscribeToCheckIfUserExists(result: Observable<HttpResponse<any>>) {
        result.subscribe((res) => this.checkIfUserExistsSuccess(res.body[0]), response => this.checkIfUserExistsError(response));
      }
    
      protected checkIfUserExistsSuccess(response) {
        if(response.count === "0"){
          this.getOTP();
        }
        else {
          alert ("User already registered, login instead.");    
        }
      }
    
      protected checkIfUserExistsError(responce) {
        alert(responce.error.errorText);
      }
    
      getOTP(){
        firebase.auth().signInWithPhoneNumber(`${this.registerForm.value.country_code}${this.registerForm.value.phone_number}`, this.recaptchaVerifier)
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
        this.confirmationResult.confirm(this.registerForm.value.otp).then(user=>{
        
        this.firebaseUid = user.user.uid;
        this.registerUser();
        })
        }

        registerUser(){
         var payload
          if(this.registerForm.value.referral_code){
            const array = [...this.registerForm.value.referral_code];
            var refereeUserId = "";
            for(var i=4; i<array.length;i++){ 
              var subArray = [];
              subArray.push(array[i]);  
              var temp = subArray.join('');
              refereeUserId = refereeUserId+temp
            }
           
            payload = {
              "email": `${this.registerForm.value.country_code}${this.registerForm.value.phone_number}`,
              "password": this.firebaseUid,
              "phone_number": parseInt(this.registerForm.value.phone_number),
              "first_name" : this.registerForm.value.first_name,
              "last_name" : this.registerForm.value.last_name,
              "role": "USER",
              "referred_source": `${array[2]}${array[3]}`,
              "referee_user_id":parseInt(refereeUserId),
              "referral_code": this.registerForm.value.referral_code
            }
        }
        else{
          payload = {
            "email": `${this.registerForm.value.country_code}${this.registerForm.value.phone_number}`,
            "password": this.firebaseUid,
            "phone_number": parseInt(this.registerForm.value.phone_number),
            "first_name" : this.registerForm.value.first_name,
            "last_name" : this.registerForm.value.last_name,
            "role": "USER",
            "referred_source": "UN"           
          }
        }
          console.log('payload register:', payload);
          this.subscribeToRegisterUser(this._commonHttpService.create(payload, 'mscservices/addUserWithReferral'));
        }
        protected subscribeToRegisterUser(result: Observable<HttpResponse<any>>) {
          result.subscribe((res) => this.registerUserSuccess(res.body[0]), response => this.registerUserError(response));
        }
      
        protected registerUserSuccess(response) {
          console.log('responce:', response);
          this.loginUser();
        }
      
        protected registerUserError(responce) {
          alert(responce.error.errorText);      
        }

      
  loginUser(){
    var payload = {
      "email": `${this.registerForm.value.country_code}${this.registerForm.value.phone_number}`,
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
