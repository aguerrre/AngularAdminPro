import { Component, Input, SimpleChange } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {

  @Input() public title = 'Sin título';
  @Input() public chartLabels: string[] = [];
  @Input() public chartData: number[] = [0];
  @Input() public chartColors: string[] = ['#000'];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.chartLabels,
    datasets: [
      {
        data: this.chartData,
        backgroundColor: this.chartColors
      },
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  ngOnChanges(changes: SimpleChange) {
    this.doughnutChartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.chartData,
          backgroundColor: this.chartColors
        }
      ],
    }
  };

}
