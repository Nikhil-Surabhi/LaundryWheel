import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from '../services/common-http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { localUserDetails, UserDetails } from '../interfaces/interfaces'
// interface localUserDetails {
//     user_id?: number
//     access_token?: string
//   }
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    
    localUserDetails: localUserDetails;
    userDetails =  UserDetails;

    constructor(
        private _commonHttpService : CommonHttpService,
        private router: Router,
    
      ) { }

    ngOnInit() {
        if(localStorage.getItem('user_details') || sessionStorage.getItem('user_details')){
            this.localUserDetails = localStorage.getItem('user_details')?JSON.parse(localStorage.getItem('user_details')):JSON.parse(sessionStorage.getItem('user_details'));
            console.log('localStorage.getItem',this.localUserDetails);
        } 
        this.getUserDetails();
        
    }
   

    logout(){
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigateByUrl('home');
    }

    getUserDetails(){
        console.log('localStorage. 3232',this.localUserDetails);

        console.log('localStorage.getItem',this.localUserDetails.user_id);

        this.subscribeToGetUserDetails(this._commonHttpService.get(`Users/${this.localUserDetails.user_id}?access_token=${this.localUserDetails.access_token}`));
      }
      protected subscribeToGetUserDetails(result: Observable<HttpResponse<any>>) {
        result.subscribe((res) => this.getUserDetailsSuccess(res.body), response => this.getUserDetailsError(response));
      }
    
      protected getUserDetailsSuccess(response) {
        this.userDetails = response;
       console.log('service user details',this.userDetails);
      }
    
      protected getUserDetailsError(responce) {
        alert(responce.error.errorText);
        
      }

}
