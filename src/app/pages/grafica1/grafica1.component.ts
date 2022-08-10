import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public data1: number[] = [350, 450, 100];
  public colors1: string[] = ['#33F622', '#52F04E', '#16A80E'];

  public labels2: string[] = ['Proveedor 1', 'Proveedor 2', 'Proveedor 3', 'Proveedor 4'];
  public data2: number[] = [500, 125, 220, 360];
  public colors2: string[] = ['#AAA', '#BBB', '#EEE', '#222'];

  public labels3: string[] = ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5', 'Producto 6'];
  public data3: number[] = [100, 88, 66, 45, 134, 23];
  public colors3: string[] = ['#FE0', '#5ED', '#48F', '#9CB', '#789', '#AD8'];
  
}
