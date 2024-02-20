import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.css']
})
export class SchedulePickupComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    ) { }
  ngOnInit(): void {
  }

  //programatically closing dialog
  closeDialog(){
    const dialogRef = this.dialog.open(SchedulePickupComponent)
    dialogRef.close();
  }
}
