import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';

import { ProgressIncrementComponent } from './progress-increment/progress-increment.component';
import { FormsModule } from '@angular/forms';
import { DoughnutComponent } from './doughnut/doughnut.component';



@NgModule({
  declarations: [
    ProgressIncrementComponent,
    DoughnutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
  ],
  exports: [
    ProgressIncrementComponent,
    DoughnutComponent,
  ]
})
export class ComponentsModule { }
