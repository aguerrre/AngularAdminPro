import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';

import { ProgressIncrementComponent } from './progress-increment/progress-increment.component';
import { FormsModule } from '@angular/forms';
import { DoughnutComponent } from './doughnut/doughnut.component';
import { ModalImgComponent } from './modal-img/modal-img.component';



@NgModule({
  declarations: [
    ProgressIncrementComponent,
    DoughnutComponent,
    ModalImgComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
  ],
  exports: [
    ProgressIncrementComponent,
    DoughnutComponent,
    ModalImgComponent,
  ]
})
export class ComponentsModule { }
