import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchedulePickupComponent } from '../schedule-pickup/schedule-pickup.component';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    page = 2;
    page1 = 3;
    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;
    isLoggedin = false;
    isAdmin = false;
    user_details: any;
    constructor(
        public dialog: MatDialog
        ) { }

    ngOnInit() {
        if(localStorage.getItem('user_details') || sessionStorage.getItem('user_details')){
            this.isLoggedin = true;
            this.user_details = localStorage.getItem('user_details')?JSON.parse(localStorage.getItem('user_details')):JSON.parse(sessionStorage.getItem('user_details'));

            console.log(this.user_details.role,'this.user_details')
            if(this.user_details.role === 'USER'){
                this.isAdmin = true;
            }
          } 
    }

    openSchedulePickup() {
        const dialogRef = this.dialog.open(SchedulePickupComponent);
        this.dialog.open(SchedulePickupComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
          });
      }
}
