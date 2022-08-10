import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [
    './progress.component.css'
  ]
})
export class ProgressComponent {

  progressValue1: number = 25;
  progressValue2: number = 35;

  get getProgressValue1() {
    return `${this.progressValue1}%`;
  }

  get getProgressValue2() {
    return `${this.progressValue2}%`;
  }

}
